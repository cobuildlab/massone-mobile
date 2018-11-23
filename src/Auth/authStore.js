import Flux from 'flux-state';
import { AsyncStorage } from "react-native";
import { LOG, WARN, ERROR, storeErrorHandler } from "../utils";

class AuthStore extends Flux.DashStore {
  constructor() {
    super();

    this.addEvent('Login', (nextState) => {
      AsyncStorage.setItem("user", JSON.stringify(nextState))
        .then(() => {
          LOG(this, "user saved to local storage");
        })
        .catch(err => {
          ERROR(this, err);
        });

      return nextState;
    });

    this.addEvent('Logout', (nextState) => {
      AsyncStorage.clear()
        .then(() => {
          LOG(this, "AsyncStorage deleted");
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
