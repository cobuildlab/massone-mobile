import { isValidString, isValidNumber, isValidInteger } from '../utils';
import { i18n } from '../utils/i18n';

const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'];

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

/**
 * Validator to Create service order to close job
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
const closeJobValidator = (
  jobId,
  equipment,
  completionNotes,
  workCompleted,
  workPerformed,
  // parts,
  // laborHours,
  // laborOvertime,
  materials,
  equipmentUsed,
  // refrigerantInventory,
  // signature,
) => {
  if (!isValidInteger(jobId)) {
    throw new Error(i18n.t('JOBS.invalidJob'));
  }

  if (!isValidString(equipment, false, true)) {
    throw new Error(i18n.t('JOBS.invalidEquipment'));
  }

  if (!isValidString(completionNotes, false, true)) {
    throw new Error(i18n.t('JOBS.invalidCompletionNotes'));
  }

  if (typeof workCompleted !== 'boolean') {
    throw new Error(i18n.t('JOBS.invalidWorkCompleted'));
  }

  if (!isValidString(workPerformed)) {
    throw new Error(i18n.t('JOBS.emptyWorkPerformed'));
  }

  // if (!Array.isArray(parts) || !parts.length) {
  //   throw new Error(i18n.t('JOBS.emptyParts'));
  // }
  // for (const part of parts) {
  //   if (!isValidInteger(part)) {
  //     throw new Error(i18n.t('JOBS.invalidParts'));
  //   }
  // }

  // if (!isValidInteger(laborHours)) {
  //   throw new Error(i18n.t('JOBS.emptyLaborHours'));
  // }

  // if (!isValidInteger(laborOvertime, true)) {
  //   throw new Error(i18n.t('JOBS.emptyLabourOvertime'));
  // }

  if (!isValidString(materials, false, true)) {
    throw new Error(i18n.t('JOBS.invalidMaterials'));
  }

  if (!isValidString(equipmentUsed, false, true)) {
    throw new Error(i18n.t('JOBS.invalidEquipmentUsed'));
  }

  // if (!isValidString(refrigerantInventory, false, true)) {
  //   throw new Error(i18n.t('JOBS.invalidRefrigerantInventory'));
  // }

  // if (!isValidString(signature)) {
  //   throw new Error(i18n.t('JOBS.invalidSignature'));
  // }
};

export { commentJobValidator, pauseJobValidator, closeJobValidator };
