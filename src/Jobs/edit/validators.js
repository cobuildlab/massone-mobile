import * as utils from '../../utils';
import { i18n } from '../../utils/i18n';
import moment from 'moment';

/**
 * Validator the job create form
 * @param {number} location the location id
 * @param {number} job_type the job type id
 * @param {string} title the title for the job
 * @param {string} description the description for the job
 * @param {string} date_start the start date
 * @param {string} date_finish the end date
 * @param {string} priority the initial priority of the job
 * @param {string} status the initial status of the job
 * @param {number} employee the employee id
 * @param {boolean} alert_employee a boolean asking if it should alert employee
 * @param {boolean} email_customer a boolean asking if it should email the client
 */
export const createJobValidator = (job) => {
  if (!utils.isValidString(job.title)) {
    throw new Error(i18n.t('JOB_EDIT.emptyIssue'));
  }

  if (!utils.isValidString(job.description)) {
    throw new Error(i18n.t('JOB_EDIT.emptyDescription'));
  }

  if (job.date_start !== null && job.date_finish !== null) {
    if (moment(job.date_start).isSameOrAfter(moment(job.date_finish))) {
      throw new Error(i18n.t('JOB_EDIT.invalidDates'));
    }
  }

  if (!utils.isValidString(job.priority)) {
    throw new Error(i18n.t('JOB_EDIT.invalidPriority'));
  }

  if (!utils.isValidString(job.status)) {
    throw new Error(i18n.t('JOB_EDIT.invalidStatus'));
  }

  if (!utils.isValidInteger(job.job_type)) {
    throw new Error(i18n.t('JOB_EDIT.invalidJobType'));
  }

  if (!utils.isValidInteger(job.location)) {
    throw new Error(i18n.t('JOB_EDIT.invalidCustomer'));
  }

  if (job.employee !== null) {
    if (!utils.isValidInteger(job.employee)) {
      throw new Error(i18n.t('JOB_EDIT.invalidEmployee'));
    }
  } else throw new Error(i18n.t('JOB_EDIT.invalidEmployee'));

  if (typeof job.alert_employee !== 'boolean') {
    throw new Error(i18n.t('JOB_EDIT.invalidAlertEmployee'));
  }

  if (typeof job.email_customer !== 'boolean') {
    throw new Error(i18n.t('JOB_EDIT.invalidEmailCustomer'));
  }
};
