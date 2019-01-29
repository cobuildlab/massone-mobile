import { isValidString, isValidNumber, isValidInteger } from '../utils';
import { i18n } from '../utils/i18n';

const validFileTypes = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'application/pdf',
];

const pauseJobValidator = (jobId, message, reasonId) => {
  if (!isValidNumber(jobId)) {
    throw new Error(i18n.t('JOBS.invalidJob'));
  }

  if (!isValidInteger(reasonId)) {
    throw new Error(i18n.t('JOBS.invalidReason'));
  }

  if (!isValidString(message, true)) {
    throw new Error(i18n.t('JOBS.invalidMessage'));
  }
};

/**
 * Login validator
 * @param  {string} jobId
 * @param  {string} message
 * @param  {array} files
 * @throws {Error} if there is a invalid or missing value
 */
const commentJobValidator = (jobId, message, files) => {
  if (!isValidNumber(jobId)) {
    throw new Error(i18n.t('JOBS.invalidJob'));
  }

  if (!isValidString(message)) {
    throw new Error(i18n.t('JOBS.emptyMessage'));
  }

  if (files !== undefined) {
    if (!Array.isArray(files) || !files.length) {
      throw new Error(i18n.t('JOBS.invalidFiles'));
    }

    for (const file of files) {
      if (!isValidString(file.uri)) {
        throw new Error(i18n.t('JOBS.invalidFiles'));
      }
      if (!isValidString(file.name)) {
        throw new Error(i18n.t('JOBS.invalidFiles'));
      }
      if (isValidString(file.type)) {
        let isValidType = false;
        for (const type of validFileTypes) {
          if (file.type === type) isValidType = true;
        }

        if (!isValidType) throw new Error(i18n.t('JOBS.invalidFileType'));
      } else throw new Error(i18n.t('JOBS.invalidFiles'));
    }
  }
};

export { commentJobValidator, pauseJobValidator };
