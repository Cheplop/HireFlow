import { createContext, useCallback, useContext } from "react";
import { useApplications } from "./ApplicationsContext";
import { useJobs } from "./JobsContext";

const ApplicantsContext = createContext(null);

export function ApplicantsProvider({ children }) {
  const {
    getApplicationsForJob,
    getApplicationById,
    setApplicationStatus,
  } = useApplications();
  const { getJobById } = useJobs();

  const getApplicantsByJob = useCallback(
    (jobId, employerId) => {
      const job = getJobById(jobId);
      if (!job || job.employerId !== employerId) return [];

      return getApplicationsForJob(job.id).map((application) => ({
        ...application.applicant,
        id: application.id,
        status: application.status,
      }));
    },
    [getApplicationsForJob, getJobById],
  );

  const getStatus = useCallback(
    (applicationId, jobId) => {
      const application = getApplicationById(applicationId);
      return application?.jobId === Number(jobId)
        ? application.status
        : "Pending";
    },
    [getApplicationById],
  );

  const updateApplicationStatus = useCallback(
    (applicationId, jobId, status, employerId) => {
      const application = getApplicationById(applicationId);
      if (!application || application.jobId !== Number(jobId)) {
        throw new Error("Application not found for this job.");
      }
      setApplicationStatus(applicationId, employerId, status);
    },
    [getApplicationById, setApplicationStatus],
  );

  return (
    <ApplicantsContext.Provider
      value={{
        getApplicantsByJob,
        getStatus,
        updateApplicationStatus,
      }}
    >
      {children}
    </ApplicantsContext.Provider>
  );
}

export function useApplicants() {
  const context = useContext(ApplicantsContext);

  if (!context) {
    throw new Error("useApplicants must be used within ApplicantsProvider.");
  }

  return context;
}
