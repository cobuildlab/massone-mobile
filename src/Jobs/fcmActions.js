import Flux from 'flux-state';
import { putData } from '../utils/fetch';

/**
 * Update FcmToken  action
 * @param  {string} fcmToken
 * @param  {string} fcmTokenStored the previous fcmToken stored
 */
const updateFcmToken = (fcmTokenStored, fcmToken) => {
  // TODO: Change the url & object properties to match the API
  putData(`/update-fcm-token/`, { fcmTokenStored, fcmToken })
    .then((data) => {
      Flux.dispatchEvent('UpdateFcmToken', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('FcmStoreError', err);
    });
};

export { updateFcmToken };
