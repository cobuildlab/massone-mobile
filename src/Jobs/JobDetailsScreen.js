/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import { Alert, View, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Text, Content, Icon } from 'native-base';
import styles from './JobDetailsStyle';
import { CustomHeader, Loading, CustomToast } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import authStore from '../Auth/authStore';
import jobStore from './jobStore';
import moment from 'moment';
import JobDetailOptions from './JobDetailOption';
import { LOG, validateRoles } from '../utils';

class JobDetailsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      job: {},
      lastFiveJobs: [],
      additionalWorkers: [],
      loadingLastJobs: true,
      jobId: props.navigation.getParam('jobId', null),
    };
  }

  componentDidMount() {
    this.getJobSubscription = jobStore.subscribe('GetJob', this.getJobHandler);
    this.getAdditionalWorkerSubscription = jobStore.subscribe(
      'GetAdditionalWorkers',
      this.getAdditionalWorkersHandler,
    );
    this.acceptJobSubscription = jobStore.subscribe('AcceptJob', this.updateJobHandler);
    this.getLastJobsSubscription = jobStore.subscribe('GetLastJobs', this.getLastJobsHandler);
    this.pauseJobSubscription = jobStore.subscribe('PauseJob', this.updateJobHandler);
    this.startDriveSubscription = jobStore.subscribe('StartDrive', this.updateJobHandler);
    this.endDriveSubscription = jobStore.subscribe('EndDrive', this.updateJobHandler);
    this.startJobSubscription = jobStore.subscribe('StartJob', this.updateJobHandler);
    this.closeJobSubscription = jobStore.subscribe('CloseJob', this.updateJobHandler);
    this.editJobSubscription = jobStore.subscribe('EditJob', this.updateJobHandler);
    this.deleteJobSubscription = jobStore.subscribe('DeleteJob', () => {
      CustomToast(this.props.t('JOBS.jobDeleted'));
      this.props.navigation.goBack();
    });
    this.deleteAdditionalSubscription = jobStore.subscribe('DeleteAdditionalWorker', () => {
      CustomToast(this.props.t('JOBS.additionalDeleted'));
      this.refreshAdditionals();
    });
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.firstLoad();
  }

  componentWillUnmount() {
    this.getJobSubscription.unsubscribe();
    this.getAdditionalWorkerSubscription.unsubscribe();
    this.acceptJobSubscription.unsubscribe();
    this.pauseJobSubscription.unsubscribe();
    this.startDriveSubscription.unsubscribe();
    this.endDriveSubscription.unsubscribe();
    this.startJobSubscription.unsubscribe();
    this.closeJobSubscription.unsubscribe();
    this.deleteAdditionalSubscription.unsubscribe();
    this.deleteJobSubscription.unsubscribe();
    this.getLastJobsSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  getJobHandler = (job) => {
    this.setState({ isLoading: false, job }, () => {
      this.getLastJobs(job.location.id);
      this.getAdditionalWorker(job.id);
    });
  };

  getAdditionalWorkersHandler = (workers) => {
    this.setState({
      additionalWorkers: workers,
    });
  };

  getLastJobsHandler = (lastJobs) => {
    this.setState({
      lastFiveJobs: lastJobs,
      loadingLastJobs: false,
    });
  };

  refreshAdditionals = () => {
    const {
      job: { id },
    } = this.state;
    this.setState(
      {
        isLoading: false,
      },
      () => {
        this.getAdditionalWorker(id);
      },
    );
  };

  updateJobHandler = (data) => {
    this.setState({ isLoading: false });
    CustomToast(data.detail);
    this.getJob();
  };

  errorHandler = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { t } = this.props;
    const { lastFiveJobs, additionalWorkers } = this.state;
    const { employee } = this.state.job;
    const created = this.state.job.date_start
      ? moment(this.state.job.date_start)
        .tz(moment.tz.guess())
        .format('LLLL')
      : t('JOBS.notProvided');
    const threePoints =
      this.state.job.description && this.state.job.description.length > 200 ? '...' : '';
    const descriptionEntry =
      this.state.job.description && this.state.job.description.substr(0, 201) + threePoints;
    const emailLoggedIn = authStore.getState('Login') && authStore.getState('Login').email;
    return (
      <View
        style={{
          flex: 1,
        }}>
        {this.state.isLoading ? <Loading /> : null}
        <CustomHeader
          leftButton={'goBack'}
          title={t('JOBS.jobDetails')}
          rightButton={{ icon: 'md-mail', handler: this.goToComments }}
        />
        <Content
          refreshControl={
            <RefreshControl refreshing={this.state.isLoading} onRefresh={this.reloadData} />
          }
          contentContainerStyle={styles.containerFlex}>
          <Card style={styles.cardContainer}>
            <View style={styles.marginSpace}>
              <View style={styles.containerIssue}>
                <Text style={styles.keyTitle}>{t('JOBS.issue')}</Text>
                <Text style={styles.keyTitle}>{created}</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.jobTitleStyle}>{this.state.job.title}</Text>
              </View>
            </View>
            <View style={styles.marginSpace}>
              <View>
                <Text style={styles.keyTitle}>{t('JOBS.description')}</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.keyValue}>{descriptionEntry}</Text>
              </View>
            </View>
            <View style={styles.containerDoubleRow}>
              <View style={styles.widthDouble}>
                <Text style={styles.keyTitle}>{t('JOBS.startDate')}</Text>
                <Text style={styles.keyValue}>
                  {this.state.job.date_start
                    ? moment(this.state.job.date_start).format('MMM | DD | YYYY')
                    : t('JOBS.notProvided')}
                </Text>
              </View>
              <View style={styles.widthDouble}>
                <Text style={styles.keyTitle}>{t('JOBS.endDate')}</Text>
                <Text style={styles.keyValue}>
                  {this.state.job.date_finish
                    ? moment(this.state.job.date_finish).format('MMM | DD | YYYY')
                    : t('JOBS.notProvided')}
                </Text>
              </View>
            </View>
            <View style={styles.marginSpace}>
              <View>
                <Text style={styles.keyTitle}>{t('JOBS.fieldworker')}</Text>
              </View>
              <View style={[styles.valueContainer, { flexDirection: 'row' }]}>
                <Text style={styles.keyValue}>
                  {employee ? (
                    <>{`${employee.first_name} ${employee.last_name}`}</>
                  ) : (
                    'Not assigned'
                  )}
                </Text>
              </View>
            </View>
            {additionalWorkers && additionalWorkers.length > 0 && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text style={styles.keyTitle}>{t('JOBS.additionalFieldWorker')}</Text>
                </View>
                {additionalWorkers.map((res) => (
                  <View style={styles.marginSpace}>
                    <View
                      style={[
                        styles.valueContainer,
                        { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
                      ]}>
                      <View style={styles.containerText}>
                        <Text style={styles.keyValue}>
                          {`${res.employee.first_name} ${res.employee.last_name}`}
                        </Text>
                      </View>
                      <View style={styles.containerIcon}>
                        {validateRoles(['Admin', 'Massone']) && this.state.job.status !== 'Closed' && (
                          <TouchableOpacity
                            style={styles.iconDelete}
                            onPress={() =>
                              this.deleteAdditionalWorker(
                                res.id,
                                `${res.employee.first_name} ${res.employee.last_name}`,
                              )
                            }>
                            <Icon name="close" style={styles.iconClose} type="MaterialIcons" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
          {lastFiveJobs && lastFiveJobs.results && lastFiveJobs.results.length > 0 && (
            <>
              <Text style={styles.textLastJobs}>The last five jobs</Text>
              {lastFiveJobs.results.map((item) => {
                const { employee } = item;
                const created = item.date_start
                  ? moment(item.date_start)
                    .tz(moment.tz.guess())
                    .format('LLLL')
                  : t('JOBS.notProvided');
                const threePoints = item.description && item.description.length > 200 ? '...' : '';
                const description =
                  item.description && item.description.substr(0, 201) + threePoints;
                const completionNotes = item.completion_notes && item.completion_notes;
                return (
                  <Card style={styles.cardContainer}>
                    <View style={styles.marginSpace}>
                      <View style={styles.containerIssue}>
                        <Text style={styles.keyTitle}>{t('JOBS.issue')}</Text>
                        <Text style={styles.keyTitle}>{created}</Text>
                      </View>
                      <View style={styles.valueContainer}>
                        <Text style={styles.jobTitleStyle}>{item.title}</Text>
                      </View>
                    </View>
                    <View style={styles.marginSpace}>
                      <View>
                        <Text style={styles.keyTitle}>{t('JOBS.description')}</Text>
                      </View>
                      <View style={styles.valueContainer}>
                        <Text style={styles.keyValue}>{description}</Text>
                      </View>
                    </View>
                    <View style={styles.containerDoubleRow}>
                      <View style={styles.widthDouble}>
                        <Text style={styles.keyTitle}>{t('JOBS.startDate')}</Text>
                        <Text style={styles.keyValue}>
                          {item.date_start
                            ? moment(item.date_start).format('MMM | DD | YYYY')
                            : t('JOBS.notProvided')}
                        </Text>
                      </View>
                      <View style={styles.widthDouble}>
                        <Text style={styles.keyTitle}>{t('JOBS.endDate')}</Text>
                        <Text style={styles.keyValue}>
                          {item.date_finish
                            ? moment(item.date_finish).format('MMM | DD | YYYY')
                            : t('JOBS.notProvided')}
                        </Text>
                      </View>
                    </View>
                    {item.completion_notes && item.completion_notes !== '' ? (
                      <View style={styles.marginSpace}>
                        <View>
                          <Text style={styles.keyTitle}>{t('JOBS.completionNotes')}</Text>
                        </View>
                        <View style={[styles.valueContainer, { flexDirection: 'row' }]}>
                          <Text style={styles.keyValue}>{completionNotes}</Text>
                        </View>
                      </View>
                    ) : null}
                    <View style={styles.marginSpace}>
                      <View>
                        <Text style={styles.keyTitle}>{t('JOBS.fieldworker')}</Text>
                      </View>
                      <View style={[styles.valueContainer, { flexDirection: 'row' }]}>
                        <Text style={styles.keyValue}>
                          {employee ? (
                            <>{`${employee.first_name} ${employee.last_name}`}</>
                          ) : (
                            'Not assigned'
                          )}
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </>
          )}
        </Content>
        <JobDetailOptions
          t={t}
          job={this.state.job}
          emailLoggedIn={emailLoggedIn}
          acceptJob={this.acceptJob}
          startDrive={this.startDrive}
          endDrive={this.endDrive}
          startJob={this.startJob}
          goToPauseJob={this.goToPauseJob}
          goToCloseJob={this.goToCloseJob}
        />
      </View>
    );
  }

  acceptJob = () => {
    if (!this.state.job || !this.state.job.title) return;

    Alert.alert(this.props.t('JOBS.wantToAcceptJob'), this.state.job.title, [
      {
        text: this.props.t('APP.cancel'),
        onPress: () => {
          LOG(this, 'Cancel acceptJob');
        },
      },
      {
        text: this.props.t('JOBS.accept'),
        onPress: () => {
          this.setState({ isLoading: true }, () => {
            jobActions.acceptJob(this.state.job.id);
          });
        },
      },
    ]);
  };

  startDrive = () => {
    if (!this.state.job || !this.state.job.title) return;

    Alert.alert(this.props.t('JOBS.wantToStartDrive'), this.state.job.title, [
      {
        text: this.props.t('APP.cancel'),
        onPress: () => {
          LOG(this, 'Cancel startDrive');
        },
      },
      {
        text: this.props.t('JOBS.startDrive'),
        onPress: () => {
          this.setState({ isLoading: true }, () => {
            jobActions.startDrive(this.state.job.id);
          });
        },
      },
    ]);
  };

  endDrive = () => {
    if (!this.state.job || !this.state.job.title) return;

    Alert.alert(this.props.t('JOBS.wantToEndDrive'), this.state.job.title, [
      {
        text: this.props.t('APP.cancel'),
        onPress: () => {
          LOG(this, 'Cancel endDrive');
        },
      },
      {
        text: this.props.t('JOBS.endDrive'),
        onPress: () => {
          this.setState({ isLoading: true }, () => {
            jobActions.endDrive(this.state.job.id);
          });
        },
      },
    ]);
  };

  startJob = () => {
    if (!this.state.job || !this.state.job.title) return;

    Alert.alert(this.props.t('JOBS.wantToStartJob'), this.state.job.title, [
      {
        text: this.props.t('APP.cancel'),
        onPress: () => {
          LOG(this, 'Cancel startJob');
        },
      },
      {
        text: this.props.t('JOBS.start'),
        onPress: () => {
          this.setState({ isLoading: true }, () => {
            jobActions.startJob(this.state.job.id);
          });
        },
      },
    ]);
  };

  goToPauseJob = () => {
    if (!this.state.job || !this.state.job.id) return;

    this.props.navigation.navigate('PauseJob', { job: this.state.job });
  };

  goToJobHistory = () => {
    if (!this.state.job || !this.state.job.id) return;

    this.props.navigation.navigate('JobHistory', { job: this.state.job });
  };

  goToCloseJob = () => {
    const { additionalWorkers } = this.state;
    const additionalWorkerAdd = additionalWorkers.map((res) => {
      return { id_doc: res.id, ...res.employee };
    });
    if (!this.state.job || !this.state.job.id) return;
    this.props.navigation.navigate('CloseJob', {
      job: this.state.job,
      additionalWorkersEntry: additionalWorkerAdd,
    });
  };

  goToComments = () => {
    if (!this.state.job || !this.state.job.id) return;

    this.props.navigation.navigate('Comments', { jobId: this.state.job.id });
  };

  firstLoad = () => {
    this.setState({ isLoading: true }, () => {
      this.getJob();
    });
  };

  reloadData = () => {
    this.setState({ isLoading: true }, () => {
      this.getJob();
    });
  };

  getLastJobs = (id) => {
    jobActions.getLastFiveJobs(id);
  };

  handlerDeleteAdditional = (id) => {
    this.setState({ isLoading: true }, () => {
      jobActions.deleteAdditionalWorker(id);
    });
  };

  deleteAdditionalWorker = (id, name) => {
    Alert.alert(
      'Delete additional worker?',
      name,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => this.handlerDeleteAdditional(id),
        },
      ],
      { cancelable: false },
    );
  };

  getAdditionalWorker = (id) => {
    jobActions.getListAdditionalWorkers(id);
  };

  getReasonAndCommets = (id) => {
    jobActions.getReasonAndComent(id);
  };

  getJob = () => {
    jobActions.getJob(this.state.jobId);
  };
}

export default withNamespaces()(JobDetailsScreen);
