import React, { Component } from 'react';
import { Alert } from 'react-native';
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
  Footer,
  FooterTab,
} from 'native-base';
import styles from './JobDetailsStyle';
import { BLUE_MAIN } from '../constants/colorPalette';
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
      jobId: props.navigation.getParam('jobId', null),
    };
  }

  componentDidMount() {
    this.getJobSubscription = jobStore.subscribe('GetJob', this.getJobHandler);
    this.acceptJobSubscription = jobStore.subscribe(
      'AcceptJob',
      this.updateJobHandler,
    );
    this.pauseJobSubscription = jobStore.subscribe(
      'PauseJob',
      this.updateJobHandler,
    );
    this.startDriveSubscription = jobStore.subscribe(
      'StartDrive',
      this.updateJobHandler,
    );
    this.endDriveSubscription = jobStore.subscribe(
      'EndDrive',
      this.updateJobHandler,
    );
    this.startJobSubscription = jobStore.subscribe(
      'StartJob',
      this.updateJobHandler,
    );
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
    this.jobStoreError.unsubscribe();
  }

  getJobHandler = (job) => {
    this.setState({ isLoading: false, job });
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
                  {moment(this.state.job.date_finish)
                    .tz(moment.tz.guess())
                    .format('L LTS')}
                </Text>
                <Button onPress={this.goToJobHistory} iconRight block primary>
                  <Text>{t('JOBS.goToJobHistory')}</Text>
                  <Icon name="ios-list" />
                </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>
        {this.state.job.status && this.state.job.status !== 'Paused' ? (
          <Footer>
            <FooterTab>
              {this.state.job.status === 'Dispatch' ? (
                <Button onPress={this.acceptJob} primary transparent>
                  <Text>{t('JOBS.acceptJob')}</Text>
                </Button>
              ) : null}
              {this.state.job.status === 'Accept' ? (
                <Button onPress={this.startDrive} primary transparent>
                  <Text>{t('JOBS.startDrive')}</Text>
                </Button>
              ) : null}
              {this.state.job.status === 'Start Drive Time' ? (
                <Button onPress={this.endDrive} primary transparent>
                  <Text>{t('JOBS.endDrive')}</Text>
                </Button>
              ) : null}
              {this.state.job.status === 'End Drive Time' ? (
                <Button onPress={this.startJob} primary transparent>
                  <Text>{t('JOBS.startJob')}</Text>
                </Button>
              ) : null}
              {this.state.job.status === 'Start' ? (
                <Button onPress={this.goToPauseJob} danger transparent>
                  <Text>{t('JOBS.pauseJob')}</Text>
                </Button>
              ) : null}
              {this.state.job.status === 'Start' ? (
                <Button onPress={this.goToCloseJob} primary transparent>
                  <Text>{t('JOBS.closeJob')}</Text>
                </Button>
              ) : null}
            </FooterTab>
          </Footer>
        ) : null}
      </Container>
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

  getJob = () => {
    jobActions.getJob(this.state.jobId);
  };
}

export default withNamespaces()(JobDetailsScreen);
