import React, { Component } from 'react';
import { Alert } from 'react-native';
import {
  Body,
  Card,
  Label,
  Text,
  CardItem,
  Button,
  Icon,
  Title,
  Content,
  Container,
  Form,
  Item,
  Picker,
  Grid,
  Col,
} from 'native-base';
import styles from '../JobDetailsStyle';
import { BLUE_MAIN } from '../../constants/colorPalette';
import { CustomHeader, Loading, CustomToast } from '../../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from '../actions';
import jobStore from '../jobStore';
import moment from 'moment';
import { LOG } from '../../utils';
import { withNavigation } from 'react-navigation';

class JobDetailsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      job: {},
      jobId: props.navigation.getParam('jobId', null),
      employees: [],
      employeeId: null,
    };
  }

  componentDidMount() {
    this.getJobSubscription = jobStore.subscribe('GetJob', this.getJobHandler);
    this.getEmployeesSubscription = jobStore.subscribe(
      'Employees',
      (employees) => {
        this.setState({ employees });
      },
    );
    this.editJobSubscription = jobStore.subscribe('EditJob', () => {
      this.setState({ isLoading: false }, () => {
        Alert.alert(this.state.job.title, this.props.t('APP.success'));
        this.goBack();
      });
    });
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
    jobActions.getJob(this.state.jobId);
  }

  componentWillUnmount() {
    this.editJobSubscription.unsubscribe();
    this.getEmployeesSubscription.unsubscribe();
    this.getJobSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  getJobHandler = (job) => {
    this.setState({ isLoading: false, job });
    jobActions.getEmployees();
  };

  errorHandler = () => {
    this.setState({ isLoading: false });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  onSave = () => {
    this.setState({ isLoading: true }, () => {
      const { employeeId, job } = this.state;

      jobActions.editJob(this.state.jobId, {
        alert_employee: true,
        date_finish: job.date_finish === '' ? null : job.date_finish,
        date_start: job.date_start === '' ? null : job.date_start,
        description: job.description,
        email_customer: true,
        employee: employeeId,
        job_type: job.job_type.id,
        location: job.location.id,
        priority: job.priority,
        status: 'Dispatch',
        title: job.title,
      });
    });
  };

  render() {
    const { t } = this.props;
    const { job, employees, employeeId } = this.state;
    const { employee } = job;
    const fieldworkerText = employee
      ? `${employee.first_name} ${employee.last_name}`
      : `Not assigned`;

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
                  {this.state.job.date_start
                    ? moment(this.state.job.date_start)
                      .tz(moment.tz.guess())
                      .format('L LTS')
                    : t('JOBS.notProvided')}
                </Text>
                <Title>{t('JOBS.endDate')}</Title>
                <Text style={styles.textData}>
                  {this.state.job.date_finish
                    ? moment(this.state.job.date_finish)
                      .tz(moment.tz.guess())
                      .format('L LTS')
                    : t('JOBS.notProvided')}
                </Text>

                <Form>
                  <Item picker>
                    <Label>{'Fieldworker'}</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder={fieldworkerText}
                      selectedValue={employeeId}
                      onValueChange={(value) => {
                        this.setState({ employeeId: value });
                      }}>
                      {employees.map((employee) => (
                        <Picker.Item
                          label={`${employee.first_name} ${employee.last_name}`}
                          value={employee.id}
                          key={employee.id}
                        />
                      ))}
                    </Picker>
                  </Item>
                </Form>

                <Grid>
                  <Col size={4}>
                    <Button block primary onPress={this.onSave}>
                      <Text>{t('APP.save')}</Text>
                    </Button>
                  </Col>
                  <Col size={1} />
                  <Col size={4}>
                    <Button block danger onPress={this.goBack}>
                      <Text>{t('APP.cancel')}</Text>
                    </Button>
                  </Col>
                </Grid>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }

  goToComments = () => {
    if (!this.state.job || !this.state.job.id) return;

    this.props.navigation.navigate('Comments', { jobId: this.state.job.id });
  };
}

export default withNamespaces()(withNavigation(JobDetailsScreen));
