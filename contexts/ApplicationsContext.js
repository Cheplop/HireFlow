
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { applicants as seedApplicants } from "../data/applicants";
import { work } from "../data/jobs";
import { useAuth } from "./AuthContext";
import { useJobs } from "./JobsContext";

const ApplicationsContext = createContext(null);
const APPLICATIONS_STORAGE_KEY = "hireflow.applications";

export function ApplicationsProvider({ children }) {
  const { user } = useAuth();
  const { getJobById } = useJobs();

  // Seed existing sample applications
  const seededApplications = seedApplicants.flatMap((applicant) =>
    applicant.appliedJobIds.map((jobId) => ({
      jobId,
      employeeId: `seed-${applicant.id}`,
      applicant,
      status: applicant.applicationStatuses[jobId] || "Pending",
      coverLetter: "",
      appliedAt: null,
    })),
  );

  // Preserve existing legacy applications
  const legacyApplications = work
    .filter((job) => job.status)
    .map((job) => ({
      jobId: job.id,
      employeeId: "remiel",
      applicant: {
        id: "remiel",
        name: "Remiel",
        avatar: require("../assets/images/Hireflow.png"),
        education: "",
        experience: "",
        skills: [],
        contactEmail: "",
        contactPhone: "",
        about: "",
      },
      status: job.status,
      coverLetter: "",
      appliedAt: null,
    }));

  const initialApplications = [
    ...seededApplications,
    ...legacyApplications,
  ].map((application, index) => ({
    ...application,
    id: index + 1,
  }));

  const [applications, setApplications] = useState(initialApplications);
  const [hasLoadedApplications, setHasLoadedApplications] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const nextApplicationId = useRef(initialApplications.length + 1);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(APPLICATIONS_STORAGE_KEY)
      .then((stored) => {
        if (!stored || cancelled) return;
        const savedApplications = JSON.parse(stored);
        if (!Array.isArray(savedApplications)) return;
        if (!cancelled) {
          setApplications(savedApplications);
          nextApplicationId.current = Math.max(
            ...savedApplications.map((item) => Number(item.id) || 0),
            0,
          ) + 1;
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("Saved applications could not be loaded. Showing this session's data.");
      })
      .finally(() => {
        if (!cancelled) setHasLoadedApplications(true);
      });
    return () => { cancelled = true; };
  }, []);

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
        id: nextApplicationId.current,
        jobId: job.id,
        employeeId: user.id,
        applicant: {
          id: user.id,
          name: user.username,
          avatar: require("../assets/images/Hireflow.png"),
          education: "",
          experience: "",
          skills: [],
          contactEmail: "",
          contactPhone: "",
          about: "",
        },
        status: "Pending",
        coverLetter: trimmedCoverLetter,
        appliedAt: new Date().toISOString(),
      };

      nextApplicationId.current += 1;

      setApplications((current) => [...current, application]);

      return application;
    },
    [applications, getJobById],
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
