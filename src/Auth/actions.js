import Flux from 'flux-state';
import authStore from './authStore';
import {
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from './validators';
import { postData, deleteData } from '../utils/fetch';

/**
 * Login action
 * @param  {string} username
 * @param  {string} password
 * @param  {string} fcmToken
 */
const login = (username, password, fcmToken) => {
  try {
    loginValidator(username, password);
  } catch (err) {
    return Flux.dispatchEvent('AuthStoreError', err);
  }

  postData('/accounts/signin/', { username, password, fcmToken }, false)
    .then((data) => {
      data.fcmToken = fcmToken;
      Flux.dispatchEvent('Login', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('AuthStoreError', err);
    });
};

/**
 * To clear all necesary stores when logout or logoutOnUnautorized
 * then call Logout event
 */
const clearStoresAndLogout = () => {
  authStore.clearState();
  Flux.dispatchEvent('Logout', {});
};

/**
 * Action for logOut
 * // YOU MUST use logoutOnUnautorized For unautorized API error (401/403)
 */
const logout = () => {
  let fcmTokenStored;

  try {
    authStore.getState('Login').fcmToken;
  } catch (e) {
    console.warn('failed to get fcmToken from Store');
  }

  if (!fcmTokenStored) {
    console.warn('No Token on state');
    return clearStoresAndLogout();
  }

  // TODO: change API url
  deleteData(`/fcm-token/${fcmTokenStored}`)
    .then(() => {
      clearStoresAndLogout();
    })
    .catch((err) => {
      clearStoresAndLogout();
      Flux.dispatchEvent('AccountStoreError', err);
    });
};

/**
 * Logout on unautorized API response (status 401/403)
 * YOU MUST use this for unautorized API error
 */
const logoutOnUnautorized = () => {
  clearStoresAndLogout();
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
