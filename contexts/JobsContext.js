import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { work } from "../data/jobs";
import { useNotifications } from "./NotificationsContext";

const JobsContext = createContext(null);
const JOBS_STORAGE_KEY = "hireflow.jobs";

function isValidJob(job) {
  return job && job.id != null && typeof job.employerId === "string";
}

export function JobsProvider({ children }) {
  const { addNotification } = useNotifications();
  const [jobs, setJobs] = useState(work);
  const [hasLoadedJobs, setHasLoadedJobs] = useState(false);
  const nextJobId = useRef(
    Math.max(0, ...work.map((job) => Number(job.id) || 0)) + 1,
  );

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(JOBS_STORAGE_KEY)
      .then((stored) => {
        if (cancelled || !stored) return;
        try {
          const savedJobs = JSON.parse(stored);
          if (!Array.isArray(savedJobs)) return;
          const validJobs = savedJobs.filter(isValidJob);
          setJobs(validJobs);
          nextJobId.current = Math.max(0, ...validJobs.map((job) => Number(job.id) || 0)) + 1;
        } catch {
          // Keep bundled jobs when local data is malformed.
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHasLoadedJobs(true);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hasLoadedJobs) return;
    AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs)).catch(() => {});
  }, [hasLoadedJobs, jobs]);

  const getJobById = useCallback(
    (jobId) => jobs.find((job) => String(job.id) === String(jobId)),
    [jobs],
  );

  const getJobsForEmployer = useCallback(
    (employerId) =>
      jobs.filter((job) => job.employerId === employerId),
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
    addNotification({
      userId: employerId,
      recipientRole: "employer",
      type: "job_published",
      title: "Job posting published",
      message: `${newJob.jobTitle} at ${newJob.jobCompany} is now visible to job seekers.`,
      jobId: newJob.id,
      route: "/(tabs)/posts",
      dedupeKey: `job-published:${newJob.id}`,
    });
    return newJob;
  }, [addNotification]);

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
      addNotification({
        userId: employerId,
        recipientRole: "employer",
        type: "job_updated",
        title: "Job posting updated",
        message: `${updatedJob.jobTitle} at ${updatedJob.jobCompany} was updated successfully.`,
        jobId: updatedJob.id,
        route: "/(tabs)/posts",
      });
      return updatedJob;
    },
    [addNotification, getJobById],
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

  const toggleJobAvailability = useCallback(
    (jobId, employerId) => {
      const job = getJobById(jobId);
      if (!job || job.employerId !== employerId){
        throw new Error("You can only change your own job listings. ");
      }
      
      setJobs((current) =>
        current.map((item) =>
          String(item.id) === String(jobId)
            ?{ ...item, isPublished: !item.isPublished}
            : item,
        ),
      );
      addNotification({
        userId: employerId,
        recipientRole: "employer",
        type: job.isPublished ? "job_inactive" : "job_published",
        title: job.isPublished ? "Job posting unpublished" : "Job posting published",
        message: job.isPublished
          ? `${job.jobTitle} is no longer visible to job seekers.`
          : `${job.jobTitle} is visible to job seekers again.`,
        jobId: job.id,
        route: "/(tabs)/posts",
      });
    },
    [addNotification, getJobById],
  );


  return (
    <JobsContext.Provider
      value={{
        jobs,
        hasLoadedJobs,
        getJobById,
        getJobsForEmployer,
        toggleJobAvailability,
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
