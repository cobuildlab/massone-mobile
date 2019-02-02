import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Container, Spinner, ListItem } from 'native-base';
import * as jobActions from './actions';
import jobStore from './jobStore';
import styles from './JobHistoryStyle';
import {
  CustomHeader,
  CustomToast,
  Loading,
  CenteredText,
} from '../utils/components';
import { BLUE_MAIN } from '../constants/colorPalette';
import { WARN, sortByDate } from '../utils';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';

class JobsHistoryScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRefreshing: false,
      isLoadingPage: false,
      emptyHistory: false,
      nextUrl: '',
      current: null,
      jobHistory: [],
      job: props.navigation.getParam('job', {}),
    };
  }

  componentDidMount() {
    this.getJobHistorySubscription = jobStore.subscribe(
      'GetJobHistory',
      this.getJobHistoryHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.loadData();
  }

  componentWillUnmount() {
    this.getJobHistorySubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  getJobHistoryHandler = (data) => {
    // remove oldJobHistory if refreshing
    const oldJobHistory = this.state.isRefreshing ? [] : this.state.jobHistory;
    // concat oldJobHistory with new ones
    const jobHistory = sortByDate(oldJobHistory.concat(data.results));

    let emptyJobHistory = false;
    if (!jobHistory.length) emptyJobHistory = true;

    this.setState({
      isLoading: false,
      isRefreshing: false,
      isLoadingPage: false,
      nextUrl: data.next,
      current: data.current,
      emptyJobHistory,
      jobHistory,
    });
  };

  errorHandler = (err) => {
    this.setState({
      isLoading: false,
      isRefreshing: false,
      isLoadingPage: false,
    });
    CustomToast(err, 'danger');
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.jobHistory')} />

        {this.state.emptyJobHistory ? (
          <CenteredText text={`${t('JOBS.emptyJobHistory')}`} />
        ) : null}

        {Array.isArray(this.state.jobHistory) ? (
          <FlatList
            style={styles.list}
            onRefresh={this.refreshData}
            refreshing={this.state.isRefreshing}
            onEndReached={this.getNextPage}
            data={this.state.jobHistory}
            extraData={this.state}
            keyExtractor={(history) => String(history.id)}
            ListFooterComponent={() =>
              this.state.isLoadingPage ? <Spinner color={BLUE_MAIN} /> : null
            }
            renderItem={({ item: history }) => (
              <ListItem style={styles.listItem}>
                <View style={styles.viewListItem}>
                  {history.owner ? (
                    <Text style={styles.textOwner}>{`${
                      history.owner.first_name
                    } ${history.owner.last_name}`}</Text>
                  ) : null}
                  <Text note>{history.action}</Text>
                  <Text style={styles.textCreated}>
                    {moment(history.created)
                      .tz(moment.tz.guess())
                      .format('LLL')}
                  </Text>
                </View>
              </ListItem>
            )}
          />
        ) : null}
      </Container>
    );
  }

  loadData = () => {
    this.setState({ isLoading: true }, () => {
      this.getJobHistory();
    });
  };

  refreshData = () => {
    this.setState({ isRefreshing: true }, () => {
      this.getJobHistory();
    });
  };

  /**
   * This will get the next page url
   * then it will call getJobHistory with the nextUrl params
   */
  getNextPage = () => {
    if (!this.state.nextUrl || !this.state.current) return;

    try {
      const urlParams = `?page=${this.state.current + 1}`;

      this.setState({ isLoadingPage: true }, () => {
        this.getJobHistory(urlParams);
      });
    } catch (e) {
      WARN(this, `getJobHistory nextUrl Error: ${e}`);
    }
  };

  getJobHistory = (urlParams = '') => {
    jobActions.getJobHistory(this.state.job.id, urlParams);
  };
}

export default withNamespaces()(JobsHistoryScreen);