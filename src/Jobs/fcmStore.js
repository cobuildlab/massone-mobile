import Flux from 'flux-state';
import { storeErrorHandler } from '../utils';

class FcmStore extends Flux.DashStore {
  constructor() {
    super();

    this.addEvent('AddFcmToken');

    this.addEvent('UpdateFcmToken');

    this.addEvent('FcmStoreError', storeErrorHandler);
  }
}

const fcmStore = new FcmStore();

export default fcmStore;
