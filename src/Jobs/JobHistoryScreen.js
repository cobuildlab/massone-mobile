import React, { Component, Fragment } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Container, Spinner, Card, Icon } from 'native-base';
import * as jobActions from './actions';
import jobStore from './jobStore';
import styles from './JobHistoryStyle';
import { CustomHeader, CustomToast, Loading, CenteredText } from '../utils/components';
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
    this.getJobHistorySubscription = jobStore.subscribe('GetJobHistory', this.getJobHistoryHandler);
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

  _renderItem = ({ item: history }) => (
    <Card style={styles.listItem}>
      <View style={styles.viewListItem}>
        {history.owner ? (
          <>
            <View style={styles.containerOwner}>
              <Icon
                name="assignment-ind"
                style={styles.iconEmployeAndLocation}
                type="MaterialIcons"
              />
              <Text
                style={
                  styles.textOwner
                }>{`${history.owner.first_name} ${history.owner.last_name}`}</Text>
            </View>

            {Array.isArray(history.owner.user_types) && history.owner.user_types.length ? (
              <Text style={styles.rolesMainText}>
                {history.owner.user_types.map((role, index, array) => {
                  const isLast = index === array.length - 1;

                  return (
                    <Fragment key={role}>
                      <Text small style={styles.rolesText}>
                        {role}
                        {!isLast ? ', ' : ''}
                      </Text>
                    </Fragment>
                  );
                })}
              </Text>
            ) : null}
          </>
        ) : null}
        <View>
          <Text style={styles.textActionHistory}>{history.action}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row-reverse',
          }}>
          <Text style={styles.textCreated}>
            {moment(history.created)
              .tz(moment.tz.guess())
              .format('LLLL')}
          </Text>
        </View>
      </View>
    </Card>
  );

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.jobHistory')} />

        {this.state.emptyJobHistory ? <CenteredText text={`${t('JOBS.emptyJobHistory')}`} /> : null}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
          }}>
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
              renderItem={this._renderItem}
            />
          ) : null}
        </View>
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
