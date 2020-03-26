import Flux from 'flux-state';
import { storeErrorHandler } from '../utils';

/**
 * The Job store, to handle Jobs data events
 *
 * @augments Flux
 */
class JobStore extends Flux.DashStore {
  constructor() {
    super();
    /**
     * List of Jobs for the admin
     */
    this.addEvent('GetJobsForAdmin');

    /**
     * List of employees
     */
    this.addEvent('Employees');

    /**
     * Edit a Job Event
     */
    this.addEvent('EditJob');

    this.addEvent('CreateJob');

    this.addEvent('DeleteJob');

    this.addEvent('DeleteAdditionalWorker');

    this.addEvent('GetJobs');

    this.addEvent('GetLastJobs');

    this.addEvent('GetAdditionalWorkers');

    this.addEvent('GetJob');

    this.addEvent('GetJobHistory');

    this.addEvent('AcceptJob');

    this.addEvent('StartDrive');

    this.addEvent('EndDrive');

    this.addEvent('StartJob');

    this.addEvent('PauseJob');

    /*
    Create service order event to close the job
     */
    this.addEvent('CloseJob');

    /*
    start-drive, end-drive & start-job times
     */
    this.addEvent('GetJobTimes');

    this.addEvent('GetParts');

    this.addEvent('GetPauseJobReason');

    this.addEvent('CommentJob');

    this.addEvent('GetJobComments');

    this.addEvent('Signature');

    this.addEvent('SelectPart');

    this.addEvent('SearchEmployees');

    this.addEvent('SelectEmployee');

    this.addEvent('SelectEmployeeAdditional');

    this.addEvent('GetJobTypes');

    this.addEvent('SearchLocations');

    this.addEvent('SelectLocation');

    this.addEvent('JobStoreError', storeErrorHandler);
  }
}

const jobStore = new JobStore();

export default jobStore;
