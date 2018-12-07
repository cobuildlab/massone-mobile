import Flux from 'flux-state';
import { getData, putData, postFormData } from '../utils/fetch';
import { commentJobValidator, pauseJobValidator } from './validators';

/**
 * Get job list
 */
const getJobs = () => {
  getData('/job/users/')
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
  getData(`/job/users/${jobId}/`)
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
  putData(`/jobs/${jobId}/accept/`)
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
  putData(`/jobs/${jobId}/reject/`)
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
  if (Array.isArray(files)) {
    for (const file of files) {
      body.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    }
  }
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

/**
 * Get job comments list
 */
const getJobComments = (jobId) => {
  getData(`/comments/?job=${jobId}`)
    .then((data) => {
      Flux.dispatchEvent('GetJobComments', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

export {
  getJobs,
  getJob,
  acceptJob,
  rejectJob,
  pauseJob,
  commentJob,
  getJobComments,
};
