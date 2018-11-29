import React, { Component } from 'react';
import { View } from 'react-native';
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
import { CustomHeader, CustomToast, Loading } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import moment from 'moment';

class JobDetailsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      job: {},
      jobId: props.navigation.getParam('jobId', null),
    };
  }

  componentDidMount() {
    this.getJobSubscription = jobStore.subscribe('GetJob', this.getJobHandler);
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.getJob();
  }

  componentWillUnmount() {
    this.getJobSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  logoutHandler = () => {
    this.setState({ isLoading: false });
    this.props.navigation.navigate('Auth');
  };

  getJobHandler = (job) => {
    this.setState({ isLoading: false, job });
  };

  errorHandler = (err) => {
    this.setState({ isLoading: false });
    CustomToast(err, 'danger');
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader
          leftButton={'goBack'}
          title={t('JOBS.jobDetails')}
          rightButton={{ icon: 'ios-add' /*, handler: this.addComment */ }}
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
                <View style={styles.viewBtnGroup}>
                  <View style={styles.viewBtn}>
                    <Button primary block style={styles.btnLeft}>
                      <Text>{t('JOBS.accept')}</Text>
                    </Button>
                  </View>
                  <View style={styles.viewBtn}>
                    <Button danger block style={styles.btnRight}>
                      <Text>{t('JOBS.reject')}</Text>
                    </Button>
                  </View>
                </View>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }

  getJob = () => {
    this.setState({ isLoading: true }, () => {
      jobActions.getJob(this.state.jobId);
    });
  };
}

export default withNamespaces()(JobDetailsScreen);
