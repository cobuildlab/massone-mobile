import Flux from 'flux-state';
import { getData, putData } from '../utils/fetch';

/**
 * Get job list
 */
const getJobs = () => {
  getData('/jobs/user/')
    .then((data) => {
      Flux.dispatchEvent('GetJobs', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Get job details
 * @param  {number|string} jobId
 */
const getJob = (jobId) => {
  getData(`/jobs/${jobId}/`)
    .then((data) => {
      Flux.dispatchEvent('GetJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Accept job action
 * @param  {string|number} jobId
 */
const acceptJob = (jobId) => {
  putData(`/jobs/${jobId}/accept`)
    .then((data) => {
      Flux.dispatchEvent('AcceptJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Reject job action
 * @param  {string|number}  jobId
 * @param  {string}         message the reason for rejecting the job
 */
const rejectJob = (jobId) => {
  putData(`/jobs/${jobId}/accept`)
    .then((data) => {
      Flux.dispatchEvent('RejectJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

export { getJobs, getJob, acceptJob, rejectJob };
