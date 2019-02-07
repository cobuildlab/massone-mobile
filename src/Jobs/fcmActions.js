import Flux from 'flux-state';
import { putData, postData } from '../utils/fetch';

/**
 * Add FcmToken  action
 * @param  {string} fcmToken
 */
const addFcmToken = (fcmToken) => {
  postData(`/firebase/`, { fire_base_token: fcmToken })
    .then((data) => {
      Flux.dispatchEvent('UpdateFcmToken', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('FcmStoreError', err);
    });
};

/**
 * Update FcmToken  action
 * @param  {string} fcmTokenStoredId the previous fcmToken stored Id
 * @param  {string} fcmToken
 */
const updateFcmToken = (fcmTokenStoredId, fcmToken) => {
  putData(`/firebase/${fcmTokenStoredId}/`, { fire_base_token: fcmToken })
    .then((data) => {
      Flux.dispatchEvent('UpdateFcmToken', data);
    })
    .catch((err) => {
      Flux.dispatchEvent('FcmStoreError', err);
    });
};

export { addFcmToken, updateFcmToken };
