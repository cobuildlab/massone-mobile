import Flux from 'flux-state';
import {
  getData,
  postData,
  postFormData,
  putData,
  deleteData,
} from '../utils/fetch';
import {
  commentJobValidator,
  pauseJobValidator,
  closeJobValidator,
} from './validators';
import { createJobValidator } from './edit/validators';
import moment from 'moment';

/**
 * Edit job action
 * @param  {number} jobId job id
 * @param  {Job} data the job
 */
export const editJob = (jobId, data) => {
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
    .then((data) => {
      Flux.dispatchEvent('EditJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Create job action
 * @param  {Job} data the job
 */
export const createJob = (data) => {
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

  postData(`/jobs/`, data)
    .then((data) => {
      Flux.dispatchEvent('CreateJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Action to delete a specific job
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
 * Job history list action
 * @param  {string} urlParams the params for pagination
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

/**
 * Create service order to close job
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

  postData(`/service-order/`, {
    job: jobId,
    equipment,
    completion_notes: completionNotes,
    work_completed: workCompleted,
    work_performed: workPerformed,
    parts,
    labor_hours: laborHours,
    labor_overtime: laborOvertime,
    materials,
    equipment_used: equipmentUsed,
    refrigerant_inventory: refrigerantInventory,
    signature: signature,
  })
    .then((data) => {
      Flux.dispatchEvent('CloseJob', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Get parts
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
 * @param  {base64} signature
 */
const signature = (signature) => {
  setTimeout(() => {
    Flux.dispatchEvent('Signature', signature);
  });
};

/**
 * To pass the part from SearchPartsScreen to parent route
 * @param  {Object} part
 */
const selectPart = (part) => {
  setTimeout(() => {
    Flux.dispatchEvent('SelectPart', part);
  });
};

/**
 * Search employees
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
 * @param  {Object} employee
 */
const selectEmployee = (employee) => {
  setTimeout(() => {
    Flux.dispatchEvent('SelectEmployee', employee);
  });
};

/**
 * Action to get the Job start-drive, end-drive & start-job times
 * @param  {number} jobId
 */
const getJobTimes = (jobId) => {
  getData(`/job-time/${jobId}`)
    .then((data) => {
      Flux.dispatchEvent('GetJobTimes', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('JobStoreError', err);
    });
};

/**
 * Action to perfom a location search
 * @param {String} search the search term
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
 * @param  {Object} location
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
};
