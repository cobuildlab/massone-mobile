import Flux from 'flux-state';
import AsyncStorage from '@react-native-community/async-storage';
import { LOG, ERROR, storeErrorHandler } from '../utils';

/**
 * The Auth store, to handle user authentication events
 *
 * @augments Flux
 */
class AuthStore extends Flux.DashStore {
  constructor() {
    super();

    /**
     * Login event, to set or update the user's session, it will save the user
     * to AsyncStorage
     */
    this.addEvent('Login', (nextState) => {
      AsyncStorage.setItem('user', JSON.stringify(nextState))
        .then(() => {
          LOG(this, 'user saved to local storage');
          LOG(this, nextState);
        })
        .catch((err) => {
          ERROR(this, err);
        });

      return nextState;
    });

    /**
     * Logout event, it will remove user from AsyncStorage
     */
    this.addEvent('Logout', (nextState) => {
      AsyncStorage.clear()
        .then(() => {
          LOG(this, 'AsyncStorage deleted');
        })
        .catch((err) => {
          ERROR(this, err);
        });

      return nextState;
    });

    this.addEvent('ForgotPassword');

    this.addEvent('ResetPassword');

    this.addEvent('AuthStoreError', storeErrorHandler);
  }
}

const authStore = new AuthStore();

export default authStore;
