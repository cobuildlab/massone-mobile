/* eslint-disable jsdoc/require-returns */
import Flux from 'flux-state';
import { getData, postData, postFormData, putData, deleteData } from '../utils/fetch';
import { commentJobValidator, pauseJobValidator, closeJobValidator } from './validators';
import { createJobValidator } from './edit/validators';
import moment from 'moment';

/**
 * Edit job action
 *
 * @param {number} jobId job id
 * @param {Job} data the job
 * @param additionalWorker
 */
export const editJob = (jobId, data, additionalWorker) => {
  try {
    createJobValidator(data);
  } catch (e) {
    return Flux.dispatchEvent('JobStoreError', e);
  }

  if (data.date_start !== null) {
    data.date_start = moment(data.date_start).format('YYYY-MM-DD HH:mm');
  }
  if (data.date_finish !== null) {
    data.date_finish = moment(data.date_finish).format('YYYY-MM-DD HH:mm');
  }

  putData(`/jobs/${jobId}/`, data)
    .then(async (data) => {
      if (additionalWorker.length > 0) {
        await updateAdditionalWorkers(additionalWorker);
      }
      Flux.dispatchEvent('EditJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Create job action
 *
 * @param {Job} data the job
 * @param additionalWorkers
 */
export const createJob = (data, additionalWorkers) => {
  // console.log(`CREATEJOB:dataaa:`, data);
  try {
    createJobValidator(data);
  } catch (e) {
    return Flux.dispatchEvent('JobStoreError', e);
  }

  if (data.date_start !== null) {
    const start_moment = moment.utc(data.date_start);
    data.date_start = start_moment.format();
  }
  if (data.date_finish !== null) {
    const finish_moment = moment.utc(data.date_finish);
    data.date_finish = finish_moment.format();
  }
  console.log(`createJob:normalized_data:`, data);

  postData(`/jobs/`, data)
    .then(async (data) => {
      // save additional workers if exits
      const jobID = data.id;
      if (additionalWorkers.length > 0) {
        await addAdditionalWorkers(additionalWorkers, jobID);
      }
      Flux.dispatchEvent('CreateJob', data);
    })
    .catch((err) => {
      console.log('ERRORR AL crear JOB ', err);
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Action to delete a specific job
 *
 * @param {number} jobId id of the job to delete
 */
export const deleteJob = (jobId) => {
  deleteData(`/jobs/${jobId}/`)
    .then((res) => {
      Flux.dispatchEvent('DeleteJob', res);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Get the Employees List of the System
 */
export const getEmployees = () => {
  getData(`/user/employees/`)
    .then((data) => {
      Flux.dispatchEvent('Employees', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Get the Jobs for the Admin View
 */
export const getJobsForAdmin = () => {
  getData(`/job-admin/`)
    .then((data) => {
      Flux.dispatchEvent('GetJobsForAdmin', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Job list action
 *
 * @param  {string} urlParams the params for pagination
 */
const getJobs = (urlParams = '') => {
  getData(`/job/users/${urlParams}`)
    .then((data) => {
      // console.log('data entry jobss ',data)
      Flux.dispatchEvent('GetJobs', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Get job details
 *
 * @param  {number|string} jobId
 */
const getJob = (jobId) => {
  getData(`/job/users/${jobId}/`)
    .then((data) => {
      console.log(`DEBUG:jobbbb:`, data);
      Flux.dispatchEvent('GetJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * The Last Jobs list action
 *
 * @param locationId
 * @param {int} urlParams the params for pagination
 */
const getLastFiveJobs = (locationId) => {
  getData(`/location/${locationId}/last-jobs/5/`)
    .then((data) => {
      // console.log(`LAST JOBSSSS`, data);
      Flux.dispatchEvent('GetLastJobs', data);
    })
    .catch((err) => {
      console.log('errorr last jobss ', err);
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * The list additional workers action
 *
 * @param  {int} urlParams the params for pagination
 */

const getListAdditionalWorkers = (jobId) => {
  getData(`/job/${jobId}/additional-worker/`)
    .then((data) => {
      // console.log(`aditional worker`, data);
      Flux.dispatchEvent('GetAdditionalWorkers', data);
    })
    .catch((err) => {
      console.log('ERRORR aditional worker ', err);
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Delete additional worker action
 *
 * @param workerId
 * @param {int} urlParams the params for pagination
 */
const deleteAdditionalWorker = (workerId) => {
  deleteData(`/additional-worker/${workerId}/`)
    .then((res) => {
      // console.log('additional worker was deleted', res);
      Flux.dispatchEvent('DeleteAdditionalWorker', res);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Add additional workers action
 *
 * @param jobId
 * @param {int} urlParams the params for pagination
 */

const addAdditionalWorkers = (dataWorkers, jobId) => {
  const dataEntry = dataWorkers.map((res) => {
    return {
      job: jobId,
      employee: res.id, //id employee,
      worked_hours: 0,
    };
  });
  // console.log('Data to send add Additional Worker ',dataEntry);
  postData(`/job/${jobId}/additional-worker/`, dataEntry)
    .then((data) => {
      console.log('Success additional worker !! ', data);
    })
    .catch((err) => {
      console.log('Error to insert additional workers !! ', err);
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Update additional workers action
 *
 * @param dataWorkers
 * @param {Array} urlParams the params for pagination
 */

const updateAdditionalWorkers = (dataWorkers) => {
  console.log('Data to send update Additional Worker ', dataWorkers);
  putData(`/job/${dataWorkers[0].job}/additional-worker/`, dataWorkers)
    .then((data) => {
      console.log('Success update additional worker !! ', data);
    })
    .catch((err) => {
      console.log('Error to update additional workers !! ', err);
      Flux.dispatchEvent('JobStoreError', err);
    });
};
/**
 * Job history list action
 *
 * @param jobId
 * @param {string} urlParams the params for pagination
 */
const getJobHistory = (jobId, urlParams = '') => {
  getData(`/job-history/${jobId}/${urlParams}`)
    .then((data) => {
      Flux.dispatchEvent('GetJobHistory', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * get comments and reason when job is paused
 *
 * @param {int} jobId
 */

const getReasonAndComent = (jobId) => {
  getData(`/job/${jobId}/status-history/`)
    .then((data) => {
      console.log('dataa PAUSED ', data);
      if (data.results.length > 0) {
        const lastElement = data.results[data.results.length - 1];
        Flux.dispatchEvent('GetCommentsAndReason', lastElement);
      }
    })
    .catch((err) => {
      console.log('dataa PAUSED ERRORR', err);
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Accept job action
 *
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
 *
 * @param {string|number} jobId
 * @param {string} message the reason why you are pausing the job
 * @param reasonId
 */
const pauseJob = (jobId, message, reasonId) => {
  try {
    pauseJobValidator(jobId, message, reasonId);
  } catch (err) {
    return Flux.dispatchEvent('JobStoreError', err);
  }

  postData(`/jobs/${jobId}/paused/`, { comment: message, reason_id: reasonId })
    .then((data) => {
      console.log('Job PAUSED SUCCESS ', data);
      Flux.dispatchEvent('PauseJob', data);
    })
    .catch((err) => {
      console.log('Job PAUSED Err ', err);
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
 *
 * @param  {string|number}  jobId
 * @param  {string}         message
 * @param  {Array}          files
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
 *
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
 *
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
 *
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
 *
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

/**
 * Create service order to close job
 *
 * @param {number} jobId
 * @param {string} equipment
 * @param {string} completionNotes
 * @param {boolean} workCompleted
 * @param {string} workPerformed
 * @param {Array of number} parts
 * @param {int} laborHours
 * @param {int} laborOvertime
 * @param {string} materials
 * @param {string} equipmentUsed
 * @param {string} refrigerantInventory
 * @param {base64} signature
 * @param worked_time
 * @param worked_overtime
 * @param worked_hours_additional
 */
const closeJob = (
  jobId,
  equipment,
  completionNotes,
  workCompleted,
  workPerformed,
  parts,
  laborHours,
  laborOvertime,
  materials,
  equipmentUsed,
  refrigerantInventory,
  signature,
  worked_time,
  worked_overtime,
  worked_hours_additional,
) => {
  try {
    closeJobValidator(
      jobId,
      equipment,
      completionNotes,
      workCompleted,
      workPerformed,
      parts,
      laborHours,
      laborOvertime,
      materials,
      equipmentUsed,
      refrigerantInventory,
      signature,
    );
  } catch (err) {
    return Flux.dispatchEvent('JobStoreError', err);
  }

  const payload = {
    job: jobId,
    equipment,
    completion_notes: completionNotes,
    work_completed: workCompleted,
    work_performed: workPerformed,
    labor_hours: 1,
    labor_overtime: 1,
    materials,
    equipment_used: equipmentUsed,
    refrigerant_inventory: refrigerantInventory,
    worked_time,
    worked_overtime,
  };

  if (parts.length > 0) payload.parts = parts;

  if (signature !== '') payload.signature = signature;

  postData(`/service-order/`, payload)
    .then((data) => {
      console.log('Job closed success ', data);
      if (worked_hours_additional.length > 0) {
        updateAdditionalWorkers(worked_hours_additional);
      }
      Flux.dispatchEvent('CloseJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Get parts
 *
 * @param  {string} search
 */
const getParts = (search = '') => {
  getData(`/parts/?search=${search}`)
    .then((data) => {
      Flux.dispatchEvent('GetParts', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * To pass the signature from SignatureScreen to parent route
 *
 * @param  {base64} signature
 */
const signature = (signature) => {
  setTimeout(() => {
    Flux.dispatchEvent('Signature', signature);
  });
};

/**
 * To pass the part from SearchPartsScreen to parent route
 *
 * @param  {object} part
 */
const selectPart = (part) => {
  setTimeout(() => {
    Flux.dispatchEvent('SelectPart', part);
  });
};

/**
 * Search employees
 *
 * @param  {string} search
 */
const searchEmployees = (search = '') => {
  getData(`/user/employee/?search=${search}`)
    .then((data) => {
      Flux.dispatchEvent('SearchEmployees', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * To pass the employee from SearchEmployeeScreen to parent route
 *
 * @param {object} employee
 * @param isAdditional
 */
const selectEmployee = (employee, isAdditional) => {
  setTimeout(() => {
    if (isAdditional) {
      Flux.dispatchEvent('SelectEmployeeAdditional', employee);
    } else {
      Flux.dispatchEvent('SelectEmployee', employee);
    }
  });
};

/**
 * Action to get the Job start-drive, end-drive & start-job times
 *
 * @param  {number} jobId
 */
const getJobTimes = (jobId) => {
  getData(`/job-time/${jobId}/`)
    .then((data) => {
      Flux.dispatchEvent('GetJobTimes', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Action to perfom a location search
 *
 * @param {string} search the search term
 */
export const searchLocations = (search) => {
  getData(`/locations/search/?q=${search}`)
    .then((locations) => {
      Flux.dispatchEvent('SearchLocations', locations);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * To pass the location from SearchLocationScreen to parent route
 *
 * @param  {object} location
 */
export const selectLocation = (location) => {
  setTimeout(() => {
    Flux.dispatchEvent('SelectLocation', location);
  });
};

/**
 * Action to get the job types
 */
export const getJobTypes = () => {
  getData(`/job-types/`)
    .then((types) => {
      Flux.dispatchEvent('GetJobTypes', types);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

export {
  getLastFiveJobs,
  updateAdditionalWorkers,
  addAdditionalWorkers,
  deleteAdditionalWorker,
  getListAdditionalWorkers,
  getJobs,
  getJob,
  getJobHistory,
  acceptJob,
  startDrive,
  endDrive,
  startJob,
  getJobTimes,
  pauseJob,
  getPauseJobReason,
  closeJob,
  getParts,
  commentJob,
  getJobComments,
  signature,
  selectPart,
  selectEmployee,
  searchEmployees,
  getReasonAndComent,
};
