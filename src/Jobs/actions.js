import Flux from 'flux-state';
import { getData, postData, postFormData } from '../utils/fetch';
import { commentJobValidator, pauseJobValidator } from './validators';

/**
 * Job list action
 * @param  {string} urlParams the params for pagination
 */
const getJobs = (urlParams = '') => {
  getData(`/job/users/${urlParams}`)
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
  postData(`/jobs/${jobId}/accept/`)
    .then((data) => {
      Flux.dispatchEvent('AcceptJob', data);
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
const pauseJob = (jobId, message, reasonId) => {
  try {
    pauseJobValidator(jobId, message, reasonId);
  } catch (err) {
    return Flux.dispatchEvent('JobStoreError', err);
  }

  postData(`/jobs/${jobId}/paused/`, { message, reason_id: reasonId })
    .then((data) => {
      Flux.dispatchEvent('PauseJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Get pause job reason list
 */
const getPauseJobReason = () => {
  getData(`/reason-paused-job/`)
    .then((data) => {
      Flux.dispatchEvent('GetPauseJobReason', data);
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
 * @param  {string} urlParams MUST contain ?job=
 */
const getJobComments = (urlParams = '') => {
  getData(`/comments/${urlParams}`)
    .then((data) => {
      Flux.dispatchEvent('GetJobComments', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Start drive job action
 * @param  {string|number} jobId
 */
const startDrive = (jobId) => {
  postData(`/jobs/${jobId}/start-drive/`)
    .then((data) => {
      Flux.dispatchEvent('StartDrive', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * End drive job action
 * @param  {string|number} jobId
 */
const endDrive = (jobId) => {
  postData(`/jobs/${jobId}/end-drive/`)
    .then((data) => {
      Flux.dispatchEvent('EndDrive', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * start job action
 * @param  {string|number} jobId
 */
const startJob = (jobId) => {
  postData(`/jobs/${jobId}/start/`)
    .then((data) => {
      Flux.dispatchEvent('StartJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

export {
  getJobs,
  getJob,
  acceptJob,
  startDrive,
  endDrive,
  startJob,
  pauseJob,
  getPauseJobReason,
  commentJob,
  getJobComments,
};
