
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "./AuthContext";
import { useJobs } from "./JobsContext";

const ApplicationsContext = createContext(null);
const APPLICATIONS_STORAGE_KEY = "hireflow.applications";

export function ApplicationsProvider({ children }) {
  const { user, isKnownUserId } = useAuth();
  const { getJobById, hasLoadedJobs } = useJobs();

  // Applications are created only by a real local account. Bundled job data
  // is intentionally not accompanied by fake application records.
  const initialApplications = [];

  const [applications, setApplications] = useState(initialApplications);
  const [hasLoadedApplications, setHasLoadedApplications] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!hasLoadedJobs) return () => { cancelled = true; };
    AsyncStorage.getItem(APPLICATIONS_STORAGE_KEY)
      .then(async (stored) => {
        if (!stored || cancelled) return;
        const savedApplications = JSON.parse(stored);
        if (!Array.isArray(savedApplications)) return;
        const validApplications = [];
        for (const item of savedApplications) {
          if (!item?.id || !item?.employeeId || !item?.jobId) continue;
          if (!getJobById(item.jobId)) continue;
          if (!(await isKnownUserId(item.employeeId))) continue;
          validApplications.push(item);
        }
        if (!cancelled) {
          setApplications(validApplications);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("Saved applications could not be loaded. Showing this session's data.");
      })
      .finally(() => {
        if (!cancelled) setHasLoadedApplications(true);
      });
    return () => { cancelled = true; };
  }, [getJobById, hasLoadedJobs, isKnownUserId]);

  useEffect(() => {
    if (!hasLoadedApplications) return;
    AsyncStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications))
      .then(() => setSaveError(""))
      .catch((error) => {
        setSaveError(
          error instanceof Error
            ? `Application changes could not be saved: ${error.message}`
            : "Application changes could not be saved.",
        );
      });
  }, [applications, hasLoadedApplications]);

  // Create an application
  const applyForJob = useCallback(
    (jobId, user, coverLetter) => {
      const job = getJobById(jobId);

      if (!hasLoadedApplications) {
        throw new Error("Applications are still loading. Please try again.");
      }

      if (user?.role !== "employee" || !job?.isPublished) {
        throw new Error("This job is not available for your account.");
      }

      const trimmedCoverLetter =
        typeof coverLetter === "string" ? coverLetter.trim() : "";

      if (
        trimmedCoverLetter.length < 50 ||
        trimmedCoverLetter.length > 1000
      ) {
        throw new Error(
          "Your cover letter must contain between 50 and 1000 characters.",
        );
      }

      if (
        applications.some(
          (application) =>
            application.jobId === job.id &&
            application.employeeId === user.id,
        )
      ) {
        throw new Error("You have already applied for this job.");
      }

      const application = {
        id: `application-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        jobId: job.id,
        employeeId: user.id,
        applicant: {
          id: user.id,
          name: user.username,
          email: user.email,
          avatar: require("../assets/images/Hireflow.png"),
          education: "",
          experience: "",
          skills: [],
          contactEmail: user.email,
          contactPhone: "",
          about: "",
        },
        status: "Pending",
        coverLetter: trimmedCoverLetter,
        appliedAt: new Date().toISOString(),
      };

      setApplications((current) => [...current, application]);

      return application;
    },
    [applications, getJobById, hasLoadedApplications],
  );

  // Get one employee's application for a specific job
  const getApplication = useCallback(
    (jobId, employeeId) =>
      applications.find(
        (application) =>
          application.jobId === Number(jobId) &&
          application.employeeId === employeeId,
      ),
    [applications],
  );

  // Get application using its ID
  const getApplicationById = useCallback(
    (applicationId) =>
      applications.find(
        (application) =>
          String(application.id) === String(applicationId),
      ),
    [applications],
  );

  // Get all applications submitted by an employee
  const getApplicationsForEmployee = useCallback(
    (employeeId) =>
      applications.filter(
        (application) => application.employeeId === employeeId,
      ),
    [applications],
  );

  // Get all applications submitted to a job
  const getApplicationsForJob = useCallback(
    (jobId) =>
      applications.filter(
        (application) => application.jobId === Number(jobId),
      ),
    [applications],
  );

  // Allow employees to edit their pending applications
  const updateEmployeeApplication = useCallback(
    (applicationId, employeeId, changes) => {
      const application = getApplicationById(applicationId);

      if (
        !application ||
        application.employeeId !== employeeId ||
        application.status !== "Pending"
      ) {
        throw new Error("Only your pending applications can be edited.");
      }

      const trimmedCoverLetter =
        typeof changes.coverLetter === "string"
          ? changes.coverLetter.trim()
          : "";

      if (
        trimmedCoverLetter.length < 50 ||
        trimmedCoverLetter.length > 1000
      ) {
        throw new Error(
          "Your cover letter must contain between 50 and 1000 characters.",
        );
      }

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? { ...item, coverLetter: trimmedCoverLetter }
            : item,
        ),
      );
    },
    [getApplicationById],
  );

  // Allow employees to withdraw pending applications
  const withdrawApplication = useCallback(
    (applicationId, employeeId) => {
      const application = getApplicationById(applicationId);

      if (
        !application ||
        application.employeeId !== employeeId ||
        application.status !== "Pending"
      ) {
        throw new Error(
          "Only your pending applications can be withdrawn.",
        );
      }

      setApplications((current) =>
        current.filter((item) => item.id !== application.id),
      );
    },
    [getApplicationById],
  );

  // Allow employers to update application status
  const setApplicationStatus = useCallback(
    async (applicationId, employerId, status) => {
      if (!hasLoadedApplications) {
        throw new Error("Applications are still loading. Please try again.");
      }

      const application = getApplicationById(applicationId);
      const job = application && getJobById(application.jobId);

      const allowedStatuses = [
        "Pending",
        "Accepted",
        "Declined",
        "Completed",
      ];

      if (
        user?.role !== "employer" ||
        user.id !== employerId ||
        !application ||
        !job ||
        job.employerId !== user.id
      ) {
        throw new Error(
          "You can only manage applicants for your own jobs.",
        );
      }

      if (!allowedStatuses.includes(status)) {
        throw new Error("Choose a valid application status.");
      }

      const allowedTransitions = {
        Pending: ["Accepted", "Declined"],
        Accepted: ["Completed"],
        Declined: [],
        Completed: [],
      };
      if (!allowedTransitions[application.status]?.includes(status)) {
        throw new Error("This application cannot be moved to that status.");
      }

      const updatedApplications = applications.map((item) =>
        item.id === application.id ? { ...item, status } : item,
      );
      try {
        await AsyncStorage.setItem(
          APPLICATIONS_STORAGE_KEY,
          JSON.stringify(updatedApplications),
        );
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? `Could not save application status: ${error.message}`
            : "Could not save application status. Please try again.",
        );
      }
      setSaveError("");
      setApplications(updatedApplications);
    },
    [applications, getApplicationById, getJobById, hasLoadedApplications, user],
  );

  // Allow employers to delete applications for their own jobs
  const deleteApplicationsForJob = useCallback(
    (jobId, employerId) => {
      const job = getJobById(jobId);

      if (!job || job.employerId !== employerId) {
        throw new Error(
          "You can only delete applicants for your own jobs.",
        );
      }

      setApplications((current) =>
        current.filter(
          (application) => application.jobId !== job.id,
        ),
      );
    },
    [getJobById],
  );

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        hasLoadedApplications,
        loadError,
        saveError,
        applyForJob,
        getApplication,
        getApplicationById,
        getApplicationsForEmployee,
        getApplicationsForJob,
        updateEmployeeApplication,
        withdrawApplication,
        setApplicationStatus,
        deleteApplicationsForJob,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);

  if (!context) {
    throw new Error(
      "useApplications must be used within ApplicationsProvider.",
    );
  }

  return context;
}
