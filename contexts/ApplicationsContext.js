import { createContext, useCallback, useContext, useState } from 'react';
import { work } from '../data/jobs';

const ApplicationsContext = createContext(null);

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState(() =>
    work
      .filter((job) => job.status)
      .map((job) => ({ jobId: job.id, status: job.status }))
  );

  const applyForJob = useCallback((jobId) => {
    setApplications((current) => {
      if (current.some((application) => application.jobId === jobId)) {
        return current;
      }

      return [...current, { jobId, status: 'Pending' }];
    });
  }, []);

  const getApplication = useCallback(
    (jobId) => applications.find((application) => application.jobId === jobId),
    [applications]
  );

  return (
    <ApplicationsContext.Provider value={{ applications, applyForJob, getApplication }}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);

  if (!context) {
    throw new Error('useApplications must be used within ApplicationsProvider.');
  }

  return context;
}
