import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import {
  Body,
  Card,
  Text,
  CardItem,
  Button,
  Icon,
  Title,
  Content,
  Container,
} from 'native-base';
import styles from './JobDetailsStyle';
import { BLUE_MAIN } from '../constants/colorPalette';
import { CustomHeader, Loading } from '../utils/components';
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
      jobId: props.navigation.getParam('jobId', null),
    };
  }

  componentDidMount() {
    this.getJobSubscription = jobStore.subscribe('GetJob', this.getJobHandler);
    this.acceptJobSubscription = jobStore.subscribe(
      'AcceptJob',
      this.updateJobHandler,
    );
    this.rejectJobSubscription = jobStore.subscribe(
      'RejectJob',
      this.updateJobHandler,
    );
    this.pauseJobSubscription = jobStore.subscribe(
      'PauseJob',
      this.updateJobHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.firstLoad();
  }

  componentWillUnmount() {
    this.getJobSubscription.unsubscribe();
    this.acceptJobSubscription.unsubscribe();
    this.rejectJobSubscription.unsubscribe();
    this.pauseJobSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  getJobHandler = (job) => {
    this.setState({ isLoading: false, job });
  };

  updateJobHandler = () => {
    this.setState({ isLoading: false });
    this.getJob();
  };

  errorHandler = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader
          leftButton={'goBack'}
          title={t('JOBS.jobDetails')}
          rightButton={{ icon: 'md-mail', handler: this.goToComments }}
        />

        <Content>
          <Card transparent>
            <CardItem>
              <Body>
                <Title>{t('JOBS.issue')}</Title>
                <Text style={styles.textData}>{this.state.job.title}</Text>
                <Title>{t('JOBS.description')}</Title>
                <Text style={styles.textData}>
                  {this.state.job.description}
                </Text>
                {this.state.job.customer ? (
                  <>
                    <Title>{t('JOBS.customer')}</Title>
                    <Text style={styles.textData}>
                      {`${this.state.job.customer.first_name} ${
                        this.state.job.customer.last_name
                      }`}
                    </Text>
                  </>
                ) : null}
                {this.state.job.location ? (
                  <>
                    <Title>{t('JOBS.contact')}</Title>
                    <Text style={styles.textDataContact}>
                      <Text>{this.state.job.location.name}</Text>
                      <Text>
                        {' '}
                        <Icon
                          type="MaterialIcons"
                          name="phone"
                          style={{
                            color: BLUE_MAIN,
                            fontSize: 14,
                            marginTop: 5,
                          }}
                        />{' '}
                        {this.state.job.location.phone_number}
                      </Text>
                    </Text>
                  </>
                ) : null}
                {this.state.job.job_type ? (
                  <>
                    <Title>{t('JOBS.type')}</Title>
                    <Text style={styles.textData}>
                      {this.state.job.job_type.name}
                    </Text>
                  </>
                ) : null}
                <Title>{t('JOBS.status')}</Title>
                <Text style={styles.textData}>{this.state.job.status}</Text>
                <Title>{t('JOBS.priority')}</Title>
                <Text style={styles.textData}>{this.state.job.priority}</Text>
                <Title>{t('JOBS.startDate')}</Title>
                <Text style={styles.textData}>
                  {moment(this.state.job.date_start)
                    .tz(moment.tz.guess())
                    .format('L LTS')}
                </Text>
                <Title>{t('JOBS.endDate')}</Title>
                <Text style={styles.textData}>
                  {moment(this.state.job.date_end)
                    .tz(moment.tz.guess())
                    .format('L LTS')}
                </Text>

                {this.state.job.status === 'Open' ? (
                  <View style={styles.viewBtnGroup}>
                    <View style={styles.viewBtn}>
                      <Button
                        onPress={this.acceptJob}
                        primary
                        block
                        style={styles.btnLeft}>
                        <Text>{t('JOBS.accept')}</Text>
                      </Button>
                    </View>
                    <View style={styles.viewBtn}>
                      <Button
                        onPress={this.rejectJob}
                        danger
                        block
                        style={styles.btnRight}>
                        <Text>{t('JOBS.reject')}</Text>
                      </Button>
                    </View>
                  </View>
                ) : null}

                {/* TODO: DON'T DELETE, this must be added when employeeStatus
                  is ready on the API, to allow the user to pause job
                  this.state.job.employeeStatus === 'Accepted' ? (
                  <Button
                    onPress={this.goToPauseJob}
                    primary
                    block
                    style={styles.buttonPause}>
                    <Text>{t('JOBS.pauseJob')}</Text>
                  </Button>
                ) : null */}
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }

  rejectJob = () => {
    if (!this.state.job || !this.state.job.title) return;

    Alert.alert(this.props.t('JOBS.wantToRejectJob'), this.state.job.title, [
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
            jobActions.rejectJob(this.state.job.id);
          });
        },
      },
    ]);
  };

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

  goToPauseJob = () => {
    if (!this.state.job || !this.state.job.id) return;

    this.props.navigation.navigate('PauseJob', { job: this.state.job });
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

  getJob = () => {
    jobActions.getJob(this.state.jobId);
  };
}

export default withNamespaces()(JobDetailsScreen);
