import React, { Component } from 'react';
import {
  Body,
  Item,
  Input,
  Label,
  Text,
  Button,
  Icon,
  Content,
  Container,
  Form,
  Grid,
  Col,
  ListItem,
  Picker,
  CheckBox,
} from 'native-base';
import { BLUE_MAIN } from '../../constants/colorPalette';
import { CustomHeader, Loading, CustomToast } from '../../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from '../actions';
import jobStore from '../jobStore';
import moment from 'moment';
// import { LOG } from '../../utils';
import { withNavigation } from 'react-navigation';
import { JOB_STATUS_LIST, JOB_CLOSED, JOB_DISPATCH } from './jobStatus';
import { JOB_PRIORITY_LIST } from './jobPriority';
import DateTimePicker from 'react-native-modal-datetime-picker';

class JobEditScreen extends Component {
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
      statusList: JOB_STATUS_LIST.filter((status) => status !== JOB_CLOSED),
      priorityList: JOB_PRIORITY_LIST,
      jobTypeList: [],
      isStartDatePickerVisible: false,
      isEndDatePickerVisible: false,
    };
  }

  componentDidMount() {
    this.getJobSubscription = jobStore.subscribe('GetJob', this.getJobHandler);
    this.selectEmployeesSubscription = jobStore.subscribe('SelectEmployee', this.selectEmployee);
    this.selectLocationSubscription = jobStore.subscribe('SelectLocation', this.selectLocation);
    this.editJobSubscription = jobStore.subscribe('EditJob', () => {
      this.setState({ isLoading: false }, () => {
        CustomToast(this.props.t('JOB_EDIT.jobUpdated'));
        this.goBack();
      });
    });
    this.getJobTypesSubscription = jobStore.subscribe('GetJobTypes', (jobTypeList) => {
      this.setState({ jobTypeList });
    });
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
    jobActions.getJob(this.state.jobId);
    this.getJobTypes();
  }

  componentWillUnmount() {
    this.editJobSubscription.unsubscribe();
    this.selectEmployeesSubscription.unsubscribe();
    this.selectLocationSubscription.unsubscribe();
    this.getJobSubscription.unsubscribe();
    this.getJobTypesSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  getJobHandler = (job) => {
    job.alert_employee = true;
    job.email_customer = true;
    (job.job_type = job.job_type ? job.job_type.id : null),
    this.setState({ isLoading: false, job });
  };

  errorHandler = () => {
    this.setState({ isLoading: false });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  /**
   * returns the id of the selected object field
   */
  getId = (fieldName, object) => {
    try {
      return object[fieldName].id || null;
    } catch {
      return null;
    }
  };

  onSave = () => {
    this.setState({ isLoading: true }, () => {
      const { job } = this.state;

      jobActions.editJob(this.state.jobId, {
        alert_employee: job.alert_employee,
        email_customer: job.email_customer,
        date_finish: job.date_finish || null,
        date_start: job.date_start || null,
        employee: this.getId('employee', job),
        location: this.getId('location', job),
        description: job.description,
        priority: job.priority,
        job_type: job.job_type,
        status: job.status,
        title: job.title,
      });
    });
  };

  selectEmployee = (employee) => {
    const { job } = this.state;
    job.employee = employee;
    job.status = JOB_DISPATCH;
    this.setState({ job });
  };

  deleteEmployee = () => {
    const { job } = this.state;
    job.employee = null;
    this.setState({ job });
  };

  selectLocation = (location) => {
    const { job } = this.state;
    job.location = location;
    this.setState({ job });
  };

  deleteLocation = () => {
    const { job } = this.state;
    job.location = null;
    this.setState({ job });
  };

  onChangeText = (name, value) => {
    const { job } = this.state;
    job[name] = value;
    this.setState({ job });
  };

  onChangeBoolean = (name) => {
    const { job } = this.state;
    job[name] = !job[name];
    this.setState({ job });
  };

  goToSearchEmployee = () => {
    this.props.navigation.navigate('SearchEmployee');
  };

  goToSearchLocation = () => {
    this.props.navigation.navigate('SearchLocation');
  };

  getJobTypes = () => {
    jobActions.getJobTypes();
  };

  showStartDatePicker = () => this.setState({ isStartDatePickerVisible: true });

  hideStartDatePicker = () => this.setState({ isStartDatePickerVisible: false });

  onStartDatePicked = (date) => {
    const { job } = this.state;
    job.date_start = date;
    this.setState({ job });
    this.hideStartDatePicker();
  };

  showEndDatePicker = () => this.setState({ isEndDatePickerVisible: true });

  hideEndDatePicker = () => this.setState({ isEndDatePickerVisible: false });

  onEndDatePicked = (date) => {
    const { job } = this.state;
    job.date_finish = date;
    this.setState({ job });
    this.hideEndDatePicker();
  };

  render() {
    const { t } = this.props;
    const { job, statusList, priorityList, jobTypeList } = this.state;
    const { employee } = job;
    const fieldworkerText = employee
      ? `${employee.first_name} ${employee.last_name}`
      : t('JOB_EDIT.selectEmployee');

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}
        <CustomHeader leftButton={'goBack'} title={t('JOB_EDIT.editJob')} />
        <Content>
          <DateTimePicker
            mode={'datetime'}
            isVisible={this.state.isStartDatePickerVisible}
            onConfirm={this.onStartDatePicked}
            onCancel={this.hideStartDatePicker}
          />

          <DateTimePicker
            mode={'datetime'}
            isVisible={this.state.isEndDatePickerVisible}
            onConfirm={this.onEndDatePicked}
            onCancel={this.hideEndDatePicker}
          />

          <Form>
            <Item stackedLabel>
              <Label>{t('JOB_EDIT.issue')}</Label>
              <Input
                value={job.title}
                placeholder={t('JOB_EDIT.issue')}
                onChangeText={(value) => this.onChangeText('title', value)}
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOB_EDIT.description')}</Label>
              <Input
                multiline
                value={job.description}
                placeholder={t('JOB_EDIT.description')}
                onChangeText={(value) => this.onChangeText('description', value)}
              />
            </Item>
            <ListItem onPress={this.showStartDatePicker} button noIndentBodyText>
              <Body style={{ marginVertical: 10 }}>
                <Text>
                  <Text style={{ color: '#575757' }}>{`${t('JOBS.startDate')} `}</Text>
                  {job.date_start
                    ? moment(job.date_start)
                      .tz(moment.tz.guess())
                      .format('L LTS')
                    : t('JOBS.notProvided')}
                </Text>
              </Body>
            </ListItem>
            <ListItem onPress={this.showEndDatePicker} button noIndentBodyText>
              <Body style={{ marginVertical: 10 }}>
                <Text>
                  <Text style={{ color: '#575757' }}>{`${t('JOBS.endDate')} `}</Text>
                  {job.date_finish
                    ? moment(job.date_finish)
                      .tz(moment.tz.guess())
                      .format('L LTS')
                    : t('JOBS.notProvided')}
                </Text>
              </Body>
            </ListItem>
            {Array.isArray(priorityList) ? (
              <Item>
                <Picker
                  placeholder={t('JOB_EDIT.selectPriority')}
                  headerBackButtonText={t('APP.goBack')}
                  iosHeader={t('JOB_EDIT.selectPriority')}
                  iosIcon={<Icon name="ios-arrow-down" />}
                  style={{ width: undefined, marginVertical: 10 }}
                  selectedValue={job.priority}
                  onValueChange={(value) => this.onChangeText('priority', value)}>
                  <Picker.Item label={t('JOB_EDIT.selectPriority')} value={null} />
                  {priorityList.map((priority) => (
                    <Picker.Item key={priority} label={priority} value={priority} />
                  ))}
                </Picker>
              </Item>
            ) : null}
            {Array.isArray(statusList) ? (
              <Item>
                <Picker
                  placeholder={t('JOB_EDIT.selectStatus')}
                  headerBackButtonText={t('APP.goBack')}
                  iosHeader={t('JOBS.selectStatus')}
                  iosIcon={<Icon name="ios-arrow-down" />}
                  style={{ width: undefined, marginVertical: 10 }}
                  selectedValue={job.status}
                  onValueChange={(value) => this.onChangeText('status', value)}>
                  <Picker.Item label={t('JOB_EDIT.selectStatus')} value={null} />
                  {statusList.map((status) => (
                    <Picker.Item key={status} label={status} value={status} />
                  ))}
                </Picker>
              </Item>
            ) : null}
            {Array.isArray(jobTypeList) ? (
              <Item>
                <Picker
                  placeholder={t('JOB_EDIT.selectJobType')}
                  headerBackButtonText={t('APP.goBack')}
                  iosHeader={t('JOBS.selectJobType')}
                  iosIcon={<Icon name="ios-arrow-down" />}
                  style={{ width: undefined, marginVertical: 10 }}
                  selectedValue={job.job_type}
                  onValueChange={(value) => this.onChangeText('job_type', value)}>
                  <Picker.Item label={t('JOB_EDIT.selectJobType')} value={null} />
                  {jobTypeList.map((type) => (
                    <Picker.Item key={type.id} label={type.name} value={type.id} />
                  ))}
                </Picker>
              </Item>
            ) : null}
            <ListItem button noIndentBodyText onPress={this.goToSearchLocation}>
              <Body style={{ marginVertical: 10 }}>
                <Text>{job.location ? job.location.name : t('JOB_EDIT.selectLocation')}</Text>
              </Body>
              {job.location && job.location.id ? (
                <Button title={'Delete Location'} onPress={this.deleteLocation} danger>
                  <Icon name="md-close" />
                </Button>
              ) : (
                <Button title={'Search'} onPress={this.goToSearchLocation} primary>
                  <Text>{t('JOBS.search')}</Text>
                </Button>
              )}
            </ListItem>
            <ListItem button noIndentBodyText onPress={this.goToSearchEmployee}>
              <Body style={{ marginVertical: 15 }}>
                <Text>{fieldworkerText}</Text>
              </Body>
              {employee && employee.id ? (
                <Button title={'Delete Employee'} onPress={this.deleteEmployee} danger>
                  <Icon name="md-close" />
                </Button>
              ) : (
                <Button title={'Search'} onPress={this.goToSearchEmployee} primary>
                  <Text>{t('JOBS.search')}</Text>
                </Button>
              )}
            </ListItem>
            <ListItem button onPress={() => this.onChangeBoolean('alert_employee')}>
              <CheckBox
                style={{ marginVertical: 10 }}
                onPress={() => this.onChangeBoolean('alert_employee')}
                checked={job.alert_employee}
                color={BLUE_MAIN}
              />
              <Body>
                <Text>{t('JOB_EDIT.alertEmployee')}</Text>
              </Body>
            </ListItem>
            <ListItem button onPress={() => this.onChangeBoolean('email_customer')}>
              <CheckBox
                style={{ marginVertical: 10 }}
                onPress={() => this.onChangeBoolean('email_customer')}
                checked={job.email_customer}
                color={BLUE_MAIN}
              />
              <Body>
                <Text>{t('JOB_EDIT.emailCustomer')}</Text>
              </Body>
            </ListItem>
          </Form>

          <Grid style={{ marginVertical: 10 }}>
            <Col size={1} />
            <Col size={4}>
              <Button title={'CANCEL'} block danger onPress={this.goBack}>
                <Text>{t('APP.cancel')}</Text>
              </Button>
            </Col>
            <Col size={1} />
            <Col size={4}>
              <Button title={'SAVE'} block primary onPress={this.onSave}>
                <Text>{t('APP.save')}</Text>
              </Button>
            </Col>
            <Col size={1} />
          </Grid>
        </Content>
      </Container>
    );
  }
}

export default withNamespaces()(withNavigation(JobEditScreen));
