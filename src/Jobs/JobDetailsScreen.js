/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import { Alert, View, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Text, Content } from 'native-base';
import styles from './JobDetailsStyle';
import { CustomHeader, Loading, CustomToast } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import moment from 'moment';
import { LOG } from '../utils';

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
      loadingLastJobs: true,
      jobId: props.navigation.getParam('jobId', null),
    };
  }

  componentDidMount() {
    this.getJobSubscription = jobStore.subscribe('GetJob', this.getJobHandler);
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
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.firstLoad();
  }

  componentWillUnmount() {
    this.getJobSubscription.unsubscribe();
    this.acceptJobSubscription.unsubscribe();
    this.pauseJobSubscription.unsubscribe();
    this.startDriveSubscription.unsubscribe();
    this.endDriveSubscription.unsubscribe();
    this.startJobSubscription.unsubscribe();
    this.closeJobSubscription.unsubscribe();
    this.deleteJobSubscription.unsubscribe();
    this.getLastJobsSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  getJobHandler = (job) => {
    this.setState({ isLoading: false, job }, () => {
      this.getLastJobs(job.customer.id);
    });
  };

  getLastJobsHandler = (lastJobs) => {
    this.setState({
      lastFiveJobs: lastJobs,
      loadingLastJobs: false,
    });
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
    const { lastFiveJobs } = this.state;
    const { employee } = this.state.job;
    const created = this.state.job.date_start
      ? moment(this.state.job.date_start)
        .tz(moment.tz.guess())
        .format('LLLL')
      : t('JOBS.notProvided');
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
            <View>
              <View style={styles.containerIssue}>
                <Text style={styles.keyTitle}>{t('JOBS.issue')}</Text>
                <Text style={styles.keyTitle}>{created}</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.jobTitleStyle}>{this.state.job.title}</Text>
              </View>
            </View>
            <View>
              <View>
                <Text style={styles.keyTitle}>{t('JOBS.description')}</Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.keyValue}>{this.state.job.description}</Text>
              </View>
            </View>
            <View style={styles.containerDoubleRow}>
              <View style={styles.widthDouble}>
                <Text style={styles.keyTitle}>{t('JOBS.startDate')}</Text>
                <Text style={styles.keyValue}>
                  {this.state.job.date_start
                    ? moment(this.state.job.date_start).format('DD | MMM | YYYY')
                    : t('JOBS.notProvided')}
                </Text>
              </View>
              <View style={styles.widthDouble}>
                <Text style={styles.keyTitle}>{t('JOBS.endDate')}</Text>
                <Text style={styles.keyValue}>
                  {this.state.job.date_finish
                    ? moment(this.state.job.date_finish).format('DD | MMM | YYYY')
                    : t('JOBS.notProvided')}
                </Text>
              </View>
            </View>
            <View>
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
                return (
                  <Card style={styles.cardContainer}>
                    <View>
                      <View style={styles.containerIssue}>
                        <Text style={styles.keyTitle}>{t('JOBS.issue')}</Text>
                        <Text style={styles.keyTitle}>{created}</Text>
                      </View>
                      <View style={styles.valueContainer}>
                        <Text style={styles.jobTitleStyle}>{item.title}</Text>
                      </View>
                    </View>
                    <View>
                      <View>
                        <Text style={styles.keyTitle}>{t('JOBS.description')}</Text>
                      </View>
                      <View style={styles.valueContainer}>
                        <Text style={styles.keyValue}>{item.description}</Text>
                      </View>
                    </View>
                    <View style={styles.containerDoubleRow}>
                      <View style={styles.widthDouble}>
                        <Text style={styles.keyTitle}>{t('JOBS.startDate')}</Text>
                        <Text style={styles.keyValue}>
                          {item.date_start
                            ? moment(item.date_start).format('DD | MMM | YYYY')
                            : t('JOBS.notProvided')}
                        </Text>
                      </View>
                      <View style={styles.widthDouble}>
                        <Text style={styles.keyTitle}>{t('JOBS.endDate')}</Text>
                        <Text style={styles.keyValue}>
                          {item.date_finish
                            ? moment(item.date_finish).format('DD | MMM | YYYY')
                            : t('JOBS.notProvided')}
                        </Text>
                      </View>
                    </View>
                    <View>
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
        {this.state.job.status &&
        this.state.job.status !== 'Paused' &&
        this.state.job.status !== 'Closed' ? (
            <>
              <View style={styles.containerBtnOptions}>
                {this.state.job.status === 'Dispatch' ? (
                  <TouchableOpacity style={styles.btnPrimary} onPress={this.acceptJob}>
                    <Text style={styles.textButton}>{t('JOBS.acceptJob')}</Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.job.status === 'Accept' ? (
                  <TouchableOpacity style={styles.btnPrimary} onPress={this.startDrive}>
                    <Text style={styles.textButton}>{t('JOBS.startDrive')}</Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.job.status === 'Start Drive Time' ? (
                  <TouchableOpacity style={styles.btnPrimary} onPress={this.endDrive}>
                    <Text style={styles.textButton}>{t('JOBS.endDrive')}</Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.job.status === 'End Drive Time' ? (
                  <TouchableOpacity style={styles.btnPrimary} onPress={this.startJob}>
                    <Text style={styles.textButton}>{t('JOBS.startJob')}</Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.job.status === 'Start' ? (
                  <TouchableOpacity style={styles.btnDanger} onPress={this.goToPauseJob}>
                    <Text style={styles.textButtonDanger}>{t('JOBS.pauseJob')}</Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.job.status === 'Start' ? (
                  <TouchableOpacity style={styles.btnPrimary} onPress={this.goToCloseJob}>
                    <Text style={styles.textButton}>{t('JOBS.closeJob')}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </>
          ) : null}
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
    if (!this.state.job || !this.state.job.id) return;
    this.props.navigation.navigate('CloseJob', { job: this.state.job });
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

  getJob = () => {
    jobActions.getJob(this.state.jobId);
  };
}

export default withNamespaces()(JobDetailsScreen);
