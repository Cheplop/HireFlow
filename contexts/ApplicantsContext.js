import { createContext, useCallback, useContext, useState } from "react";
import { applicants as seedApplicants } from "../data/applicants";

const ApplicantsContext = createContext(null);

export function ApplicantsProvider({ children }) {
  const [applicants, setApplicants] = useState(seedApplicants);

  const getApplicantsByJob = useCallback(
    (jobId) =>
      applicants.filter((a) => a.appliedJobIds.includes(Number(jobId))),
    [applicants],
  );

  const getStatus = useCallback(
    (applicantId, jobId) =>
      applicants.find((a) => a.id === applicantId)?.applicationStatuses[
        jobId
      ] || "Pending",
    [applicants],
  );

  const updateApplicationStatus = useCallback((applicantId, jobId, status) => {
    setApplicants((current) =>
      current.map((applicant) =>
        applicant.id === applicantId
          ? {
              ...applicant,
              applicationStatuses: {
                ...applicant.applicationStatuses,
                [jobId]: status,
              },
            }
          : applicant,
      ),
    );
  }, []);

  return (
    <ApplicantsContext.Provider
      value={{
        applicants,
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
