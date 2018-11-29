import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Button, Icon, Text, SwipeRow, Content, Container } from 'native-base';
import * as authActions from '../Auth/actions';
import authStore from '../Auth/authStore';
import * as jobActions from './actions';
import jobStore from './jobStore';
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
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.loadData();
  }

  componentWillUnmount() {
    this.logoutSubscription.unsubscribe();
    this.getJobsSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  logoutHandler = () => {
    this.setState({ isLoading: false });
    this.props.navigation.navigate('Auth');
  };

  getJobsHandler = (jobs) => {
    this.setState(
      { isLoading: false, isRefreshing: false, jobs: jobs.results },
      () => {
        this.closeAllRows();
      },
    );
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
                  <Button success>
                    <Icon active type="MaterialIcons" name="check" />
                  </Button>
                }
                body={
                  <TouchableOpacity
                    onPress={() => this.goToJobDetails(item.id)}
                    style={styles.listItem}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.issueName}>{item.title}</Text>
                      <Text>{t('JOBS.for')}</Text>
                      {item.customer ? (
                        <Text style={styles.customerName}>
                          {item.customer.first_name}
                        </Text>
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
                right={
                  <Button danger>
                    <Icon active type="MaterialIcons" name="close" />
                  </Button>
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

  logout = () => {
    this.setState({ isLoading: true }, () => {
      authActions.logout();
    });
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
