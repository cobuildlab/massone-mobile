import Flux from 'flux-state';
import { getData, putData, postFormData } from '../utils/fetch';
import { commentJobValidator, pauseJobValidator } from './validators';

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
 */
const rejectJob = (jobId) => {
  putData(`/jobs/${jobId}/reject`)
    .then((data) => {
      Flux.dispatchEvent('RejectJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Pause job action
 * @param  {string|number}  jobId
 * @param  {string}         message the reason why you are pausing the job
 */
const pauseJob = (jobId, message) => {
  try {
    pauseJobValidator(jobId, message);
  } catch (err) {
    return Flux.dispatchEvent('JobStoreError', err);
  }

  putData(`/jobs/${jobId}/pause`, { message })
    .then((data) => {
      Flux.dispatchEvent('PauseJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Comment job action
 * @param  {string|number}  jobId
 * @param  {string}         message
 * @param  {array}          files
 */
const commentJob = (jobId, message, files) => {
  try {
    commentJobValidator(jobId, message, files);
  } catch (err) {
    return Flux.dispatchEvent('JobStoreError', err);
  }

  const body = new FormData();
  if (files) body.append('files', files);
  body.append('job', jobId);
  body.append('message', message);

  postFormData(`/comments/`, body)
    .then((data) => {
      Flux.dispatchEvent('CommentJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

export { getJobs, getJob, acceptJob, rejectJob, pauseJob, commentJob };
