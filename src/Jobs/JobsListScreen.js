import React, { Component } from 'react';
import { TouchableOpacity, FlatList, Alert, View } from 'react-native';
import { Text, Container, Spinner, Icon, Card, Left, Right } from 'native-base';
import jobStore from './jobStore';
import authStore from '../Auth/authStore';
import fcmStore from './fcmStore';
import * as jobActions from './actions';
import * as authActions from '../Auth/actions';
import * as fcmActions from './fcmActions';
import styles from './JobsListStyle';
import { CustomHeader, CustomToast, Loading, CenteredText } from '../utils/components';
import { BLUE_MAIN } from '../constants/colorPalette';
import { LOG, WARN, sortByDate, validateRoles } from '../utils';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import firebase from 'react-native-firebase';

class JobsListScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  /**
   *
   * FIREBASE methods
   *
   */
  hasFcmMessagePermission = () => {
    firebase
      .messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          LOG(this, 'firebase has permission');
        } else {
          this.requestFcmMessagePermissions();
        }
      });
  };

  requestFcmMessagePermissions = () => {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        LOG(this, 'User has authorised');
      })
      .catch((err) => {
        LOG(this, err);
      });
  };

  getFcmToken = () => {
    let fcmTokenStored;
    let fcmTokenStoredId;

    try {
      fcmTokenStored = authStore.getState('Login').fcmToken;
      fcmTokenStoredId = authStore.getState('Login').fcmTokenId;
    } catch (e) {
      return WARN(this, 'failed to get fcmToken from Store');
    }

    firebase
      .messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          if (!fcmTokenStored || !fcmTokenStoredId) {
            return this.addFcmToken(fcmToken);
          }

          if (fcmTokenStored !== fcmToken) {
            return this.updateFcmToken(fcmTokenStoredId, fcmToken);
          }
        } else {
          WARN(this, 'NoFcmTokenYet');
        }
      });
  };

  onTokenRefreshHandler = (fcmToken) => {
    let fcmTokenStored;
    let fcmTokenStoredId;

    try {
      fcmTokenStored = authStore.getState('Login').fcmToken;
      fcmTokenStoredId = authStore.getState('Login').fcmTokenId;
    } catch (e) {
      return WARN(this, 'failed to get fcmToken from Store');
    }

    if (!fcmTokenStored || !fcmTokenStoredId) return this.addFcmToken(fcmToken);

    this.updateFcmToken(fcmTokenStored, fcmToken);
  };

  onNotificationOpenedHandler = (notificationOpen) => {
    if (!notificationOpen) return;
    const notification = notificationOpen.notification;
    const notificationData = notification.data;
    const type = notificationData.type_notification;
    const jobId = notificationData.job_id;
    const { navigation } = this.props;

    LOG(this, ['Notification data:', notificationData]);

    if (type === 'MS') {
      return navigation.navigate('Comments', { jobId });
    }

    if (type === 'JB' || type === 'RJ') {
      return navigation.navigate('JobDetails', { jobId });
    }
  };

  updateFcmTokenHandler = (data) => {
    const session = authStore.getState('Login') || {};
    session.fcmToken = data.fire_base_token;
    session.fcmTokenId = data.id;
    authActions.setStoredUser(session);
    LOG(this, [`fcmToken updated: Id:${session.fcmTokenId}`, session.fcmToken]);
  };

  addFcmToken = (fcmToken) => {
    fcmActions.addFcmToken(fcmToken);
  };

  updateFcmToken = (fcmTokenStoredId, fcmToken) => {
    fcmActions.updateFcmToken(fcmTokenStoredId, fcmToken);
  };

  /**
   *
   * FIREBASE methods
   *
   */

  constructor(props) {
    super(props);
    this.rowRefs = [];
    this.selectedRow;
    this.state = {
      isLoading: false,
      isRefreshing: false,
      isLoadingPage: false,
      emptyJobs: false,
      nextUrl: '',
      jobs: [],
    };
  }

  componentDidMount() {
    this.logoutSubscription = authStore.subscribe('Logout', this.logoutHandler);
    this.getJobsSubscription = jobStore.subscribe('GetJobs', this.getJobsHandler);
    this.acceptJobSubscription = jobStore.subscribe('AcceptJob', this.acceptJobHandler);
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.updateTokenSubscription = fcmStore.subscribe('UpdateFcmToken', this.updateFcmTokenHandler);
    this.updateTokenSubscription = fcmStore.subscribe('AddFcmToken', this.updateFcmTokenHandler);
    this.createJobSubscription = jobStore.subscribe('CreateJob', this.refreshData);
    this.deleteJobSubscription = jobStore.subscribe('DeleteJob', this.refreshData);
    this.editJobSubscription = jobStore.subscribe('EditJob', this.refreshData);
    this.fcmStoreError = fcmStore.subscribe('FcmStoreError', this.errorHandler);

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(this.onNotificationOpenedHandler);

    firebase
      .notifications()
      .getInitialNotification()
      .then(this.onNotificationOpenedHandler);

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(this.onTokenRefreshHandler);

    this.loadData();
    this.hasFcmMessagePermission();
    this.getFcmToken();
  }

  componentWillUnmount() {
    this.logoutSubscription.unsubscribe();
    this.getJobsSubscription.unsubscribe();
    this.acceptJobSubscription.unsubscribe();
    this.createJobSubscription.unsubscribe();
    this.editJobSubscription.unsubscribe();
    this.deleteJobSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
    this.updateTokenSubscription.unsubscribe();
    this.fcmStoreError.unsubscribe();
    this.notificationOpenedListener();
    this.onTokenRefreshListener();
  }

  getJobsHandler = (data) => {
    // remove oldJobs if refreshing
    const oldJobs = this.state.isRefreshing ? [] : this.state.jobs;
    // concat oldJobs with new ones
    const jobs = sortByDate(oldJobs.concat(data.results));

    let emptyJobs = false;
    if (!jobs.length) emptyJobs = true;

    this.setState(
      {
        isLoading: false,
        isRefreshing: false,
        isLoadingPage: false,
        nextUrl: data.next,
        emptyJobs,
        jobs,
      },
      () => {
        this.closeAllRows();
      },
    );
  };

  acceptJobHandler = (data) => {
    this.setState({ isLoading: false });
    this.getJobs();
    CustomToast(data.detail);
  };

  logoutHandler = () => {
    this.props.navigation.navigate('Auth');
  };

  errorHandler = (err) => {
    this.setState({
      isLoading: false,
      isRefreshing: false,
      isLoadingPage: false,
    });
    CustomToast(err, 'danger');
  };

  goToComments = (id) => {
    const { navigation } = this.props;
    navigation.navigate('Comments', { jobId: id });
  };

  goToJobEdit = (id) => {
    const { navigation } = this.props;
    navigation.navigate('JobEdit', { jobId: id });
  };

  deleteJob = (jobEntry) => {
    Alert.alert(this.props.t('JOBS.wantToDeleteJob'), jobEntry.title, [
      {
        text: this.props.t('APP.cancel'),
        onPress: () => {
          LOG(this, 'Cancel deleteJob');
        },
      },
      {
        text: this.props.t('JOBS.delete'),
        onPress: () => {
          this.setState({ isLoading: true }, () => {
            jobActions.deleteJob(jobEntry.id);
          });
        },
      },
    ]);
  };

  goToJobHistory = (job) => {
    const { navigation } = this.props;
    navigation.navigate('JobHistory', { job: job });
  };

  _renderItem = ({ item }) => {
    const { t } = this.props;
    const location = item.location || {};
    const created = item.created
      ? moment(item.created)
        .tz(moment.tz.guess())
        .format('LLLL')
      : t('JOBS.notProvided');
    const employee = item.employee
      ? `${item.employee.first_name} ${item.employee.last_name}`
      : t('JOBS.jobNotAssigned');
    const type = item.job_type && item.job_type.name ? item.job_type.name : t('JOBS.notAssigned');
    return (
      <Card>
        <TouchableOpacity onPress={() => this.goToJobDetails(item.id)} style={styles.listItem}>
          <View
            style={[
              styles.containerTitle,
              {
                flexDirection: item.title.length < 18 ? 'row' : 'column',
              },
            ]}>
            <Text style={[styles.issueName, styles.textTitleJob]}>
              {`${item.title.toUpperCase()} `}
            </Text>
            <Text style={styles.textDateJob}>{created}</Text>
          </View>
          <View style={styles.containerEmployee}>
            <Left>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Icon
                  name="assignment-ind"
                  style={styles.iconEmployeAndLocation}
                  type="MaterialIcons"
                />
                <Text style={styles.textStyle}>{employee}</Text>
              </View>
            </Left>
            <Right>
              <Text style={styles.textStyle}>{type}</Text>
            </Right>
          </View>
          <View style={styles.containerAddress}>
            <Icon name="location-on" style={styles.iconEmployeAndLocation} type="MaterialIcons" />
            <Text
              style={[
                styles.textStyle,
                {
                  width: '98%',
                },
              ]}>{`${location.name}, ${location.address}, ${location.city}, ${location.state}`}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row-reverse',
            }}>
            <TouchableOpacity
              onPress={() => this.goToJobHistory(item)}
              style={styles.containerIconFooter}>
              <Icon
                name="book-open-page-variant"
                style={styles.iconsFooter}
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
            {validateRoles(['Admin']) && (
              <TouchableOpacity
                onPress={() => this.deleteJob(item)}
                style={styles.containerIconFooter}>
                <Icon name="delete" style={styles.iconsFooter} type="MaterialIcons" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => this.goToComments(item.id)}
              style={styles.containerIconFooter}>
              <Icon name="comment" style={styles.iconsFooter} type="MaterialIcons" />
            </TouchableOpacity>
            {validateRoles(['Admin', 'Massone']) && (
              <TouchableOpacity
                onPress={() => this.goToJobEdit(item.id)}
                style={styles.containerIconFooter}>
                <Icon name="pencil" style={styles.iconsFooter} type="MaterialCommunityIcons" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  render() {
    const { t } = this.props;
    // console.log('withhh ',Dimensions.get('window').width)

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader
          leftButton={'openDrawer'}
          title={t('JOBS.jobsList')}
          rightButton={{ icon: 'md-add', handler: this.goToCreateJob }}
        />

        {this.state.emptyJobs ? (
          <View style={styles.emptyJobsView}>
            <CenteredText text={`${t('JOBS.emptyJobs')}`} />
          </View>
        ) : null}
        <View style={styles.containerFlatList}>
          {Array.isArray(this.state.jobs) ? (
            <FlatList
              onRefresh={this.refreshData}
              refreshing={this.state.isRefreshing}
              onEndReached={this.getNextPage}
              data={this.state.jobs}
              extraData={this.state}
              keyExtractor={(job) => String(job.id)}
              ListFooterComponent={() =>
                this.state.isLoadingPage ? <Spinner color={BLUE_MAIN} /> : null
              }
              renderItem={this._renderItem}
            />
          ) : (
            <View style={styles.emptyJobs}>
              <Text style={styles.emptyJobsText}>{t('JOBS.jobEmpty')}</Text>
            </View>
          )}
        </View>
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

  /**
   * This will get the url params for next page from the next page url
   * then it will call getJobs with the nextUrl params
   */
  getNextPage = () => {
    if (!this.state.nextUrl) return;

    try {
      const urlParams = this.state.nextUrl
        ? this.state.nextUrl.split('/job/users/')[
          this.state.nextUrl.split('/job/users/').length - 1
        ]
        : '';

      this.setState({ isLoadingPage: true }, () => {
        this.getJobs(urlParams);
      });
    } catch (e) {
      WARN(this, `getJobs nextUrl Error: ${e}`);
    }
  };

  getJobs = (urlParams = '') => {
    jobActions.getJobs(urlParams);
  };

  goToJobDetails = (jobId) => {
    this.props.navigation.navigate('JobDetails', { jobId });
  };

  goToCreateJob = () => {
    this.props.navigation.navigate('JobCreate');
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
