import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { applicants as seedApplicants } from "../data/applicants";
import { work } from "../data/jobs";
import { useJobs } from "./JobsContext";

const ApplicationsContext = createContext(null);

export function ApplicationsProvider({ children }) {
  const { getJobById } = useJobs();
  const seededApplications = seedApplicants.flatMap((applicant) =>
    applicant.appliedJobIds.map((jobId) => ({
      jobId,
      employeeId: `seed-${applicant.id}`,
      applicant,
      status: applicant.applicationStatuses[jobId] || "Pending",
      coverLetter: "",
    })),
  );
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
    }));
  const initialApplications = [...seededApplications, ...legacyApplications].map(
    (application, index) => ({ ...application, id: index + 1 }),
  );
  const [applications, setApplications] = useState(initialApplications);
  const nextApplicationId = useRef(initialApplications.length + 1);

  const applyForJob = useCallback(
    (jobId, user) => {
      const job = getJobById(jobId);
      if (user?.role !== "employee" || !job?.isPublished) {
        throw new Error("This job is not available for your account.");
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
        coverLetter: "",
      };
      nextApplicationId.current += 1;
      setApplications((current) => [...current, application]);
      return application;
    },
    [applications, getJobById],
  );

  const getApplication = useCallback(
    (jobId, employeeId) =>
      applications.find(
        (application) =>
          application.jobId === Number(jobId) &&
          application.employeeId === employeeId,
      ),
    [applications],
  );

  const getApplicationById = useCallback(
    (applicationId) =>
      applications.find(
        (application) => String(application.id) === String(applicationId),
      ),
    [applications],
  );

  const getApplicationsForEmployee = useCallback(
    (employeeId) =>
      applications.filter(
        (application) => application.employeeId === employeeId,
      ),
    [applications],
  );

  const getApplicationsForJob = useCallback(
    (jobId) =>
      applications.filter(
        (application) => application.jobId === Number(jobId),
      ),
    [applications],
  );

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

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? { ...item, coverLetter: changes.coverLetter }
            : item,
        ),
      );
    },
    [getApplicationById],
  );

  const withdrawApplication = useCallback(
    (applicationId, employeeId) => {
      const application = getApplicationById(applicationId);
      if (
        !application ||
        application.employeeId !== employeeId ||
        application.status !== "Pending"
      ) {
        throw new Error("Only your pending applications can be withdrawn.");
      }

      setApplications((current) =>
        current.filter((item) => item.id !== application.id),
      );
    },
    [getApplicationById],
  );

  const setApplicationStatus = useCallback(
    (applicationId, employerId, status) => {
      const application = getApplicationById(applicationId);
      const job = application && getJobById(application.jobId);
      const allowedStatuses = ["Pending", "Accepted", "Declined", "Completed"];

      if (!application || !job || job.employerId !== employerId) {
        throw new Error("You can only manage applicants for your own jobs.");
      }
      if (!allowedStatuses.includes(status)) {
        throw new Error("Choose a valid application status.");
      }

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id ? { ...item, status } : item,
        ),
      );
    },
    [getApplicationById, getJobById],
  );

  const deleteApplicationsForJob = useCallback(
    (jobId, employerId) => {
      const job = getJobById(jobId);
      if (!job || job.employerId !== employerId) {
        throw new Error("You can only delete applicants for your own jobs.");
      }

      setApplications((current) =>
        current.filter((application) => application.jobId !== job.id),
      );
    },
    [getJobById],
  );

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
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
