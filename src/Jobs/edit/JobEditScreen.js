import React, { Component } from 'react';
import { Slider, View, StyleSheet, Dimensions, TouchableOpacity, Switch } from 'react-native';
import { Body, Item, Input, Text, Icon, Container, ListItem, Picker } from 'native-base';
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
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  containerContent: {
    flex: 1,
    // borderWidth: 1,
    paddingHorizontal: 18,
    // borderColor: 'red',
  },
  flexOne: {
    flex: 2,
    // borderColor: 'blue',
    justifyContent: 'space-between',
    // borderWidth: 2,
  },
  fieldsText: {
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  fieldsTextSelects: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  containerTextDownSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextDownSlider: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 12 : 14,
  },
  TextDownSliderActive: {
    color: BLUE_MAIN,
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').width <= 360 ? 12 : 14,
  },
  containerTextSlider: {
    width: '24%',
  },
  containerSlider: {
    width: '76%',
  },
  fieldsSliderAndText: {
    flexDirection: 'row',
    width: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 13 : 15,
  },
  textLabelDate: {
    color: '#000000',
    fontSize: Dimensions.get('window').width <= 360 ? 16 : 18,
  },
  textLabelDateGray: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 16 : 18,
  },
  textValueInput: {
    color: '#000000',
    fontSize: Dimensions.get('window').width <= 360 ? 14 : 16,
  },
  flexTwo: {
    flex: 0.34,
    // borderColor: 'green',
    justifyContent: 'space-around',
    alignItems: 'center',
    // borderWidth: 2,
  },
  //buttons
  containerButtonsBotton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonCancel: {
    borderColor: '#D75452',
    width: '44%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    borderWidth: 2,
  },
  buttonSave: {
    borderColor: BLUE_MAIN,
    backgroundColor: BLUE_MAIN,
    width: '44%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    borderWidth: 2,
  },
  textButtonCancel: {
    color: '#D75452',
    fontWeight: '500',
  },
  textButtonSave: {
    color: 'white',
    fontWeight: '500',
  },
  textSwitchActive: {
    fontSize: 13,
  },
  textSwitchInative: {
    fontSize: 13,
    color: '#BBBBBB',
  },
  containerSwitch: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  viewSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSearch: {
    fontSize: Dimensions.get('window').width <= 360 ? 17 : 21,
    color: BLUE_MAIN,
  },
  iconClose: {
    fontSize: Dimensions.get('window').width <= 360 ? 17 : 21,
    color: '#D75452',
  },
});

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

  valueChangePriority = (val) => {
    let valInt = '';
    if (val < 1.79) valInt = 'Low';
    if (val > 1.8) valInt = 'Medium';
    if (val > 2.8) valInt = 'High';

    this.onChangeText('priority', valInt);
  };

  render() {
    const { t } = this.props;
    const { job, statusList, jobTypeList } = this.state;
    const { employee } = job;
    const fieldworkerText = employee
      ? `${employee.first_name} ${employee.last_name}`
      : t('JOB_EDIT.selectEmployee');

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}
        <CustomHeader leftButton={'goBack'} title={t('JOB_EDIT.editJob')} />
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
        <View style={styles.containerContent}>
          <ScrollView contentContainerStyle={styles.flexOne}>
            <View style={styles.fieldsText}>
              <View
                style={{
                  width: '24%',
                }}>
                <Text style={styles.textLabel}>{t('JOB_EDIT.issue')}</Text>
              </View>
              <View
                style={{
                  width: '76%',
                  height: 40,
                }}>
                <Input
                  value={job.title}
                  autoCorrect={false}
                  style={styles.textValueInput}
                  placeholder={t('JOB_EDIT.issue')}
                  onChangeText={(value) => this.onChangeText('title', value)}
                />
              </View>
            </View>
            <View style={[styles.fieldsText]}>
              <View
                style={{
                  width: '24%',
                }}>
                <Text style={styles.textLabel}>{t('JOB_EDIT.description')}</Text>
              </View>
              <View
                style={{
                  width: '76%',
                  height: 40,
                }}>
                <Input
                  multiline
                  value={job.description}
                  autoCorrect={false}
                  style={styles.textValueInput}
                  placeholder={t('JOB_EDIT.description')}
                  onChangeText={(value) => this.onChangeText('description', value)}
                />
              </View>
            </View>
            <View style={styles.fieldsText}>
              <View
                style={{
                  width: '24%',
                }}>
                <Text style={styles.textLabel}>{`${t('JOBS.startDate')} `}</Text>
              </View>
              <View
                style={{
                  width: '76%',
                }}>
                <TouchableOpacity onPress={this.showStartDatePicker}>
                  <Text style={styles.textLabelDate}>
                    {job.date_start
                      ? moment(job.date_start).format('DD | MMM | YYYY')
                      : t('JOBS.notProvided')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldsText}>
              <View
                style={{
                  width: '24%',
                }}>
                <Text style={styles.textLabel}>{`${t('JOBS.endDate')} `}</Text>
              </View>
              <View
                style={{
                  width: '76%',
                }}>
                <TouchableOpacity onPress={this.showEndDatePicker}>
                  <Text style={styles.textLabelDateGray}>
                    {job.date_finish
                      ? moment(job.date_finish).format('DD | MMM | YYYY')
                      : t('JOBS.notProvided')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.fieldsSliderAndText}>
              <View style={styles.containerTextSlider}>
                <Text style={styles.textLabel}>{`${t('JOB_EDIT.sePriority')} `}</Text>
              </View>
              <View style={styles.containerSlider}>
                <Slider
                  style={{
                    width: '100%',
                    height: 40,
                  }}
                  minimumValue={1}
                  onValueChange={(val) => this.valueChangePriority(val)}
                  value={job.priority === 'Low' ? 1 : job.priority === 'Medium' ? 2 : 3}
                  thumbTintColor={BLUE_MAIN}
                  maximumValue={3}
                  minimumTrackTintColor={BLUE_MAIN}
                  maximumTrackTintColor="#D5DBDB"
                />
                <View style={styles.containerTextDownSlider}>
                  <Text
                    style={
                      job.priority === 'Low' ? styles.TextDownSliderActive : styles.TextDownSlider
                    }>
                    Low
                  </Text>
                  <Text
                    style={
                      job.priority === 'Medium'
                        ? styles.TextDownSliderActive
                        : styles.TextDownSlider
                    }>
                    Medium
                  </Text>
                  <Text
                    style={
                      job.priority === 'High' ? styles.TextDownSliderActive : styles.TextDownSlider
                    }>
                    High
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.fieldsTextSelects}>
              <View
                style={{
                  width: '24%',
                }}>
                <Text style={styles.textLabel}>Status</Text>
              </View>
              <View
                style={{
                  width: '76%',
                }}>
                {Array.isArray(statusList) ? (
                  <Item>
                    <Picker
                      placeholder={t('JOB_EDIT.selectStatus')}
                      headerBackButtonText={t('APP.goBack')}
                      iosHeader={t('JOBS.selectStatus')}
                      iosIcon={<Icon name="ios-arrow-down" />}
                      style={{ width: '84%', marginVertical: 2 }}
                      selectedValue={job.status}
                      onValueChange={(value) => this.onChangeText('status', value)}>
                      <Picker.Item label={t('JOB_EDIT.selectStatus')} value={null} />
                      {statusList.map((status) => (
                        <Picker.Item key={status} label={status} value={status} />
                      ))}
                    </Picker>
                  </Item>
                ) : null}
              </View>
            </View>
            <View style={styles.fieldsTextSelects}>
              <View
                style={{
                  width: '24%',
                }}>
                <Text style={styles.textLabel}>Job Type</Text>
              </View>
              <View
                style={{
                  width: '76%',
                }}>
                {Array.isArray(jobTypeList) ? (
                  <Item>
                    <Picker
                      placeholder={t('JOB_EDIT.selectJobType')}
                      headerBackButtonText={t('APP.goBack')}
                      iosHeader={t('JOBS.selectJobType')}
                      iosIcon={<Icon name="ios-arrow-down" />}
                      style={{ width: '86%', marginVertical: 2 }}
                      selectedValue={job.job_type}
                      onValueChange={(value) => this.onChangeText('job_type', value)}>
                      <Picker.Item label={t('JOB_EDIT.selectJobType')} value={null} />
                      {jobTypeList.map((type) => (
                        <Picker.Item key={type.id} label={type.name} value={type.id} />
                      ))}
                    </Picker>
                  </Item>
                ) : null}
              </View>
            </View>
            <View style={styles.fieldsTextSelects}>
              <View
                style={{
                  width: '24%',
                }}>
                <Text style={styles.textLabel}>Customer</Text>
              </View>
              <View
                style={{
                  width: '76%',
                }}>
                <ListItem button noIndentBodyText onPress={this.goToSearchLocation}>
                  <Body style={{ marginVertical: 3 }}>
                    <Text>{job.location ? job.location.name : t('JOB_EDIT.selectLocation')}</Text>
                  </Body>
                  {job.location && job.location.id ? (
                    <TouchableOpacity onPress={this.deleteLocation}>
                      <Icon name="close" style={styles.iconClose} type="MaterialIcons" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={this.goToSearchLocation}>
                      <Icon name="search" style={styles.iconSearch} type="MaterialIcons" />
                    </TouchableOpacity>
                  )}
                </ListItem>
              </View>
            </View>
            <View style={styles.fieldsTextSelects}>
              <View
                style={{
                  width: '24%',
                }}>
                <Text style={styles.textLabel}>Fieldworker</Text>
              </View>
              <View
                style={{
                  width: '76%',
                }}>
                <ListItem button noIndentBodyText onPress={this.goToSearchEmployee}>
                  <Body style={{ marginVertical: 3 }}>
                    <Text>{fieldworkerText}</Text>
                  </Body>
                  {employee && employee.id ? (
                    <TouchableOpacity onPress={this.deleteEmployee}>
                      <Icon name="close" style={styles.iconClose} type="MaterialIcons" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={this.goToSearchEmployee}>
                      <Icon name="search" style={styles.iconSearch} type="MaterialIcons" />
                    </TouchableOpacity>
                  )}
                </ListItem>
              </View>
            </View>
          </ScrollView>
          <View style={styles.flexTwo}>
            <View style={styles.containerSwitch}>
              <View style={styles.viewSwitch}>
                <Switch
                  thumbColor={BLUE_MAIN}
                  onValueChange={() => this.onChangeBoolean('alert_employee')}
                  value={job.alert_employee}
                  trackColor={{
                    true: '#CAEDFA',
                    false: '#BBBBBB',
                  }}
                />
                <Text
                  style={job.alert_employee ? styles.textSwitchActive : styles.textSwitchInative}>
                  {t('JOB_EDIT.alertEmployee')}
                </Text>
              </View>
              <View style={styles.viewSwitch}>
                <Switch
                  thumbColor={BLUE_MAIN}
                  trackColor={{
                    true: '#CAEDFA',
                    false: '#BBBBBB',
                  }}
                  onValueChange={() => this.onChangeBoolean('email_customer')}
                  value={job.email_customer}
                />
                <Text
                  style={job.email_customer ? styles.textSwitchActive : styles.textSwitchInative}>
                  {t('JOB_EDIT.emailCustomer')}
                </Text>
              </View>
            </View>
            <View style={styles.containerButtonsBotton}>
              <TouchableOpacity onPress={this.goBack} style={styles.buttonCancel}>
                <Text style={styles.textButtonCancel}>{t('APP.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onSave} style={styles.buttonSave}>
                <Text style={styles.textButtonSave}>{t('APP.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

export default withNamespaces()(withNavigation(JobEditScreen));
