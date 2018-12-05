import { isValidString, isValidNumber } from '../utils';
import { i18n } from '../utils/i18n';

const pauseJobValidator = (jobId, message) => {
  if (!isValidNumber(jobId)) {
    throw new Error(i18n.t('JOBS.invalidJob'));
  }

  if (!isValidString(message)) {
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
    throw new Error(i18n.t('JOBS.invalidMessage'));
  }

  if (files !== undefined) {
    try {
      if (files.length === 0) throw new Error('Invalid files');

      for (const file of files) {
        if (!isValidString(file.uri)) throw new Error('Invalid uri');
        if (!isValidString(file.type)) throw new Error('Invalid type');
        if (!isValidString(file.name)) throw new Error('Invalid uri');
      }
    } catch (err) {
      throw new Error(i18n.t('JOBS.invalidFiles'));
    }
  }
};

export { commentJobValidator, pauseJobValidator };
