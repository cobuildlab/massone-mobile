import Flux from 'flux-state';
import { storeErrorHandler } from '../utils';

/**
 * The Job store, to handle Jobs data events
 * @extends Flux
 */
class JobStore extends Flux.DashStore {
  constructor() {
    super();

    this.addEvent('GetJobs');

    this.addEvent('GetJob');

    this.addEvent('AcceptJob');

    this.addEvent('StartDrive');

    this.addEvent('EndDrive');

    this.addEvent('StartJob');

    this.addEvent('PauseJob');

    this.addEvent('CommentJob');

    this.addEvent('GetJobComments');

    this.addEvent('JobStoreError', storeErrorHandler);
  }
}

const jobStore = new JobStore();

export default jobStore;
