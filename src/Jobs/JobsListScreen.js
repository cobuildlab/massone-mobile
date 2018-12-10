import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Button, Icon, Text, SwipeRow, Content, Container } from 'native-base';
import * as jobActions from './actions';
import jobStore from './jobStore';
import authStore from '../Auth/authStore';
import styles from './JobsListStyle';
import { CustomHeader, CustomToast, Loading } from '../utils/components';
import { LOG } from '../utils';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';

class JobsListScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.rowRefs = [];
    this.selectedRow;
    this.state = {
      isLoading: false,
      isRefreshing: false,
      jobs: [],
    };
  }

  componentDidMount() {
    this.logoutSubscription = authStore.subscribe('Logout', this.logoutHandler);
    this.getJobsSubscription = jobStore.subscribe(
      'GetJobs',
      this.getJobsHandler,
    );
    this.acceptJobSubscription = jobStore.subscribe(
      'AcceptJob',
      this.acceptJobHandler,
    );
    this.rejectJobSubscription = jobStore.subscribe(
      'RejectJob',
      this.rejectJobHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.loadData();
  }

  componentWillUnmount() {
    this.getJobsSubscription.unsubscribe();
    this.acceptJobSubscription.unsubscribe();
    this.rejectJobSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  getJobsHandler = (jobs) => {
    this.setState(
      { isLoading: false, isRefreshing: false, jobs: jobs.results },
      () => {
        this.closeAllRows();
      },
    );
  };

  acceptJobHandler = () => {
    this.setState({ isLoading: false });
    this.getJobs();
    CustomToast(this.props.t('JOBS.jobAccepted'));
  };

  rejectJobHandler = () => {
    this.setState({ isLoading: false });
    this.getJobs();
    CustomToast(this.props.t('JOBS.jobRejected'));
  };

  logoutHandler = () => {
    this.props.navigation.navigate('Auth');
  };

  errorHandler = (err) => {
    this.setState({ isLoading: false, isRefreshing: false });
    CustomToast(err, 'danger');
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'openDrawer'} title={t('JOBS.jobs')} />

        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.refreshData}
            />
          }>
          <FlatList
            style={styles.list}
            data={this.state.jobs}
            extraData={this.state}
            keyExtractor={(job) => String(job.id)}
            renderItem={({ item }) => (
              <SwipeRow
                ref={(c) => {
                  this.rowRefs[item.id] = c;
                }}
                onRowOpen={() => {
                  if (
                    this.selectedRow &&
                    this.selectedRow !== this.rowRefs[item.id]
                  ) {
                    this.selectedRow._root.closeRow();
                  }
                  this.selectedRow = this.rowRefs[item.id];
                }}
                leftOpenValue={75}
                rightOpenValue={-75}
                left={
                  <Button onPress={() => this.acceptJob(item)} success>
                    <Icon active type="MaterialIcons" name="check" />
                  </Button>
                }
                right={
                  <Button onPress={() => this.rejectJob(item)} danger>
                    <Icon active type="MaterialIcons" name="close" />
                  </Button>
                }
                body={
                  <TouchableOpacity
                    onPress={() => this.goToJobDetails(item.id)}
                    style={styles.listItem}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.issueName}>{item.title}</Text>
                      {item.customer ? (
                        <>
                          <Text>{t('JOBS.for')}</Text>
                          <Text style={styles.customerName}>
                            {item.customer.first_name}
                          </Text>
                        </>
                      ) : null}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.textDate}>{t('JOBS.startDate')}</Text>
                      <Text style={styles.textNumDate}>
                        {moment(item.date_start)
                          .tz(moment.tz.guess())
                          .format('L')}
                      </Text>
                      <Text style={styles.textDate}>{t('JOBS.endDate')}</Text>
                      <Text style={styles.textNumDate}>
                        {moment(item.date_start)
                          .tz(moment.tz.guess())
                          .format('L')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                }
              />
            )}
          />
        </Content>
      </Container>
    );
  }

  loadData = () => {
    this.setState({ isLoading: true }, () => {
      this.getJobs();
    });
  };

  refreshData = () => {
    this.setState({ isRefreshing: true }, () => {
      this.getJobs();
    });
  };

  getJobs = () => {
    jobActions.getJobs();
  };

  goToJobDetails = (jobId) => {
    this.props.navigation.navigate('JobDetails', { jobId });
  };

  rejectJob = (job) => {
    if (!job || !job.title) return;

    Alert.alert(this.props.t('JOBS.wantToRejectJob'), job.title, [
      {
        text: this.props.t('APP.cancel'),
        onPress: () => {
          LOG(this, 'Cancel rejectJob');
        },
      },
      {
        text: this.props.t('JOBS.reject'),
        onPress: () => {
          this.setState({ isLoading: true }, () => {
            jobActions.rejectJob(job.id);
          });
        },
      },
    ]);
  };

  acceptJob = (job) => {
    if (!job || !job.title) return;

    Alert.alert(this.props.t('JOBS.wantToAcceptJob'), job.title, [
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
            jobActions.acceptJob(job.id);
          });
        },
      },
    ]);
  };

  /**
   * Close all swipes on the FlatList
   */
  closeAllRows = () => {
    for (const row in this.rowRefs) {
      try {
        this.rowRefs[row]._root.closeRow();
      } catch (e) {
        LOG(`CloseSwipeError: ${e}`);
      }
    }
  };
}

export default withNamespaces()(JobsListScreen);
