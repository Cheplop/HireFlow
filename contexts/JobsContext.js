import { createContext, useCallback, useContext, useRef, useState } from "react";
import { work } from "../data/jobs";

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState(work);
  const nextJobId = useRef(
    Math.max(0, ...work.map((job) => Number(job.id) || 0)) + 1,
  );

  const getJobById = useCallback(
    (jobId) => jobs.find((job) => String(job.id) === String(jobId)),
    [jobs],
  );

  const getJobsForEmployer = useCallback(
    (employerId) =>
      jobs.filter((job) => job.employerId === employerId && job.isPublished),
    [jobs],
  );

  const createJob = useCallback((employerId, jobData) => {
    if (!employerId) {
      throw new Error("An employer account is required to publish a job.");
    }

    const newJob = {
      ...jobData,
      id: nextJobId.current,
      employerId,
      isPublished: true,
    };
    nextJobId.current += 1;
    setJobs((current) => [newJob, ...current]);
    return newJob;
  }, []);

  const updateJob = useCallback(
    (jobId, employerId, jobData) => {
      const job = getJobById(jobId);
      if (!job || job.employerId !== employerId) {
        throw new Error("You can only edit your own job listings.");
      }

      const updatedJob = { ...job, ...jobData };
      setJobs((current) =>
        current.map((item) =>
          String(item.id) === String(jobId) ? updatedJob : item,
        ),
      );
      return updatedJob;
    },
    [getJobById],
  );

  const deleteJob = useCallback(
    (jobId, employerId) => {
      const job = getJobById(jobId);
      if (!job || job.employerId !== employerId) {
        throw new Error("You can only delete your own job listings.");
      }

      setJobs((current) =>
        current.filter((item) => String(item.id) !== String(jobId)),
      );
    },
    [getJobById],
  );

  return (
    <JobsContext.Provider
      value={{
        jobs,
        getJobById,
        getJobsForEmployer,
        createJob,
        updateJob,
        deleteJob,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);

  if (!context) {
    throw new Error("useJobs must be used within JobsProvider.");
  }

  return context;
}
