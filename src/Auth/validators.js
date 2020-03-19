import { isValidString } from '../utils';
import { i18n } from '../utils/i18n';

/**
 * Login validator
 *
 * @param  {string} username
 * @param  {string} password
 * @throws {Error} if there is a invalid or missing value
 */
const loginValidator = (username, password) => {
  if (!isValidString(username)) {
    throw new Error(i18n.t('AUTH.enterYourUsername'));
  }

  if (!isValidString(password)) {
    throw new Error(i18n.t('AUTH.enterYourPassword'));
  }
};

/**
 * Forgot Password validator
 *
 * @param  {string} email
 * @throws {Error} When there is a invalid or missing value
 */
const forgotPasswordValidator = (email) => {
  if (!isValidString(email)) {
    throw new Error(i18n.t('AUTH.enterYourEmail'));
  }
};

/**
 * Reset Password Validator
 *
 * @param {string} code           [description]
 * @param {string} password       [description]
 * @param {string} repeatPassword [description]
 * @throws {Error} When there is a invalid or missing value
 */
const resetPasswordValidator = (code, password, repeatPassword) => {
  if (!isValidString(code)) {
    throw new Error(i18n.t('AUTH.invalidCode'));
  }

  if (!isValidString(password)) {
    throw new Error(i18n.t('AUTH.enterYourPassword'));
  }

  if (!isValidString(repeatPassword)) {
    throw new Error(i18n.t('AUTH.enterYourRepeatPassword'));
  }

  if (password !== repeatPassword) {
    throw new Error(i18n.t('AUTH.passwordNotMatch'));
  }
};

export { loginValidator, resetPasswordValidator, forgotPasswordValidator };
