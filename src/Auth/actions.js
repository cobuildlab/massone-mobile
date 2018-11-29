import Flux from 'flux-state';
import authStore from './authStore';
import { loginValidator, forgotPasswordValidator, resetPasswordValidator } from './validators';
import { postData } from '../utils/fetch';

/**
 * Login action
 * @param  {string} username
 * @param  {string} password
 */
const login = (username, password) => {
  try {
    loginValidator(username, password);
  } catch (err) {
    return Flux.dispatchEvent('AuthStoreError', err);
  }

  postData('/accounts/signin/', { username, password }, false)
    .then((data) => {
      Flux.dispatchEvent('Login', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('AuthStoreError', err);
    });
};

/**
 * Action for logOut, YOU MUST CLEAR ALL flux stores you need here
 * // YOU MUST use logoutOnUnautorized For unautorized API error
 * (status 401/403)
 */
const logout = () => {
  // TODO: Call API endpoints to logout

  authStore.clearState();
  return Flux.dispatchEvent('Logout', {});
};

/**
 * Logout on unautorized API response (status 401/403)
 * YOU MUST use this for unautorized API error
 */
const logoutOnUnautorized = () => {
  authStore.clearState();
  return Flux.dispatchEvent('Logout', {});
};

/**
 * Action for setting/updating the stored user from AsyncStorage/Flux or to ser user on app first load
 * @param {object} user
 */
const setStoredUser = (user) => {
  // setTimeout to avoid "cannot dispatch in the middle of dispatch"
  setTimeout(() => {
    Flux.dispatchEvent('Login', user);
  });
};

/**
 * Forgot password action
 * @param  {string} email the email to send the code to recover your password
 */
const forgotPassword = (email) => {
  try {
    forgotPasswordValidator(email);
  } catch (err) {
    return Flux.dispatchEvent('AuthStoreError', err);
  }

  postData('/accounts/send-code-email/', { email }, false)
    .then((data) => {
      Flux.dispatchEvent('ForgotPassword', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('AuthStoreError', err);
    });
};

/**
 * resetPassword action
 * @param {string]} code   the code from the email
 * @param {string]} password
 * @param {string]} repeatPassword
 */
const resetPassword = (code, password, repeatPassword) => {
  try {
    resetPasswordValidator(code, password, repeatPassword);
  } catch (err) {
    return Flux.dispatchEvent('AuthStoreError', err);
  }

  postData('/accounts/recover-password/', { code, password }, false)
    .then((data) => {
      Flux.dispatchEvent('ResetPassword', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('AuthStoreError', err);
    });
};

export {
  login,
  setStoredUser,
  logout,
  logoutOnUnautorized,
  forgotPassword,
  resetPassword,
};
