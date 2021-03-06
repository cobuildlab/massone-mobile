/* eslint-disable react/jsx-key */
import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Slider,
  ScrollView,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import { Body, Item, Input, Text, Icon, ListItem, Picker } from 'native-base';
import { BLUE_MAIN } from '../../constants/colorPalette';
import { CustomHeader, Loading, CustomToast } from '../../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from '../actions';
import jobStore from '../jobStore';
import moment from 'moment';
import { validateRoles } from '../../utils';
import { withNavigation } from 'react-navigation';
import styles from './styles';
import { JOB_STATUS_LIST, JOB_CLOSED, JOB_DISPATCH, JOB_OPEN } from './jobStatus';
import { JOB_MEDIUM, JOB_PRIORITY_LIST } from './jobPriority';
import DateTimePicker from 'react-native-modal-datetime-picker';

class JobCreateScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      job: {
        title: '',
        description: '',
        location: null,
        employee: null,
        date_start: null,
        date_finish: null,
        job_type: null,
        priority: JOB_MEDIUM,
        status: JOB_OPEN,
        email_customer: false,
        alert_employee: true,
      },
      employees: [],
      additionalWorker: [],
      statusList: JOB_STATUS_LIST.filter((status) => status !== JOB_CLOSED),
      priorityList: JOB_PRIORITY_LIST,
      jobTypeList: [],
      isStartDatePickerVisible: false,
      isEndDatePickerVisible: false,
    };
  }

  componentDidMount() {
    this.selectEmployeesAddSubscription = jobStore.subscribe(
      'SelectEmployeeAdditional',
      this.selectEmployeeAdditional,
    );
    this.selectEmployeesSubscription = jobStore.subscribe('SelectEmployee', this.selectEmployee);
    this.selectLocationSubscription = jobStore.subscribe('SelectLocation', this.selectLocation);
    this.createJobSubscription = jobStore.subscribe('CreateJob', () => {
      this.setState({ isLoading: false }, () => {
        CustomToast(this.props.t('JOB_EDIT.jobCreated'));
        this.goBack();
      });
    });
    this.getJobTypesSubscription = jobStore.subscribe('GetJobTypes', (jobTypeList) => {
      // const { job } = this.state;
      this.setState({ jobTypeList });
    });
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
    this.getJobTypes();
  }

  componentWillUnmount() {
    this.selectEmployeesAddSubscription.unsubscribe();
    this.createJobSubscription.unsubscribe();
    this.selectEmployeesSubscription.unsubscribe();
    this.selectLocationSubscription.unsubscribe();
    this.getJobTypesSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  errorHandler = () => {
    this.setState({ isLoading: false });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  /**
   * returns the id of the selected object field
   *
   * @param fieldName
   * @param object
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
      const { job, additionalWorker } = this.state;

      jobActions.createJob(
        {
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
        },
        additionalWorker,
      );
    });
  };

  selectEmployee = (employee) => {
    const { job, additionalWorker } = this.state;
    const exitsElement = additionalWorker.filter((res) => res.id === employee.id);
    if (exitsElement.length === 0) {
      job.employee = employee;
      job.status = JOB_DISPATCH;
      this.setState({ job });
    }
  };

  selectEmployeeAdditional = (employee) => {
    const { additionalWorker, job } = this.state;
    const exitsElement = additionalWorker.filter((res) => res.id === employee.id);
    if (exitsElement.length === 0 && job.employee.id !== employee.id) {
      this.setState({ additionalWorker: [...additionalWorker, employee] });
    }
  };

  deleteEmployee = () => {
    const { job } = this.state;
    job.employee = null;
    job.status = JOB_OPEN;
    this.setState({ job });
  };

  deleteAdditionalWorker = (ix) => {
    const { additionalWorker } = this.state;
    let employee = additionalWorker;
    employee = employee.filter((res, index) => index !== ix);
    this.setState({
      additionalWorker: employee,
    });
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

  goToSearchEmployee = (param) => {
    this.props.navigation.navigate('SearchEmployee', {
      additional: param ? true : false,
    });
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
    if (val <= 1.79) valInt = 'Low';
    if (val >= 1.8) valInt = 'Medium';
    if (val > 2.7) valInt = 'High';

    this.onChangeText('priority', valInt);
  };

  render() {
    const { t } = this.props;
    const { job, statusList, jobTypeList, additionalWorker } = this.state;
    const { employee } = job;
    const fieldworkerText = employee
      ? `${employee.first_name} ${employee.last_name}`
      : t('JOB_EDIT.selectEmployee');

    return (
      <View
        style={{
          flex: 1,
        }}>
        {this.state.isLoading ? <Loading /> : null}
        <CustomHeader leftButton={'goBack'} title={t('JOB_EDIT.createJob')} />
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
                  maxLength={30}
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
                  <Text style={styles.textLabelDateGray}>
                    {job.date_start
                      ? moment(job.date_start).format('MMM  |  DD  |  YYYY')
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
                      ? moment(job.date_finish).format('MMM  |  DD  |  YYYY')
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
                  width: Platform.OS === 'ios' ? '68%' : '76%',
                }}>
                {Array.isArray(statusList) ? (
                  <Item style={styles.borderNonePicker}>
                    <Picker
                      enabled={false}
                      placeholder={t('JOB_EDIT.selectStatus')}
                      headerBackButtonText={t('APP.goBack')}
                      iosHeader={t('JOBS.selectStatus')}
                      textStyle={{
                        color: job.status ? '#000000' : '#BBBBBB',
                        fontFamily: 'Arial',
                        fontSize: Dimensions.get('window').width <= 360 ? 13 : 15,
                      }}
                      style={styles.pickerStyle}
                      selectedValue={job.status}
                      onValueChange={(value) => this.onChangeText('status', value)}>
                      {statusList.map((status) => (
                        <Picker.Item key={status} label={status} value={status} />
                      ))}
                    </Picker>
                  </Item>
                ) : null}
              </View>
              {Platform.OS === 'ios' && (
                <View
                  style={{
                    width: '8%',
                  }}>
                  <Icon name="ios-arrow-down" style={{ fontSize: 16 }} />
                </View>
              )}
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
                  width: Platform.OS === 'ios' ? '68%' : '76%',
                }}>
                {Array.isArray(jobTypeList) ? (
                  <Item style={styles.borderNonePicker}>
                    <Picker
                      placeholder={t('JOB_EDIT.selectJobType')}
                      headerBackButtonText={t('APP.goBack')}
                      textStyle={{
                        color: job.job_type ? '#000000' : '#BBBBBB',
                        fontSize: Dimensions.get('window').width <= 360 ? 13 : 15,
                        fontFamily: 'Arial',
                      }}
                      iosHeader={t('JOBS.selectJobType')}
                      style={styles.pickerStyle}
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
              {Platform.OS === 'ios' && (
                <View
                  style={{
                    width: '8%',
                  }}>
                  <Icon name="ios-arrow-down" style={{ fontSize: 16 }} />
                </View>
              )}
            </View>
            <View style={styles.fieldsTextSelects}>
              <View
                style={{
                  width: Platform.OS === 'ios' ? '24%' : '22%',
                }}>
                <Text style={styles.textLabel}>Customer</Text>
              </View>
              <View
                style={{
                  width: Platform.OS === 'ios' ? '76%' : '78%',
                }}>
                <ListItem
                  style={styles.borderNonePicker}
                  button
                  noIndentBodyText
                  onPress={this.goToSearchLocation}>
                  <Body style={{ marginVertical: 3 }}>
                    <Text
                      style={{
                        color: job.location ? '#000000' : '#BBBBBB',
                        fontFamily: 'Arial',
                        fontSize: Dimensions.get('window').width <= 360 ? 13 : 15,
                      }}>
                      {job.location ? job.location.name : t('JOB_EDIT.selectLocation')}
                    </Text>
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
            <View
              style={[
                styles.fieldsTextSelects,
                {
                  marginBottom: 0,
                },
              ]}>
              <View
                style={{
                  width: Platform.OS === 'ios' ? '24%' : '22%',
                }}>
                <Text style={styles.textLabel}>Fieldworker</Text>
              </View>
              <View
                style={{
                  width: Platform.OS === 'ios' ? '76%' : '78%',
                }}>
                <ListItem
                  style={styles.borderNonePicker}
                  button
                  noIndentBodyText
                  onPress={() => this.goToSearchEmployee()}>
                  <Body>
                    <Text
                      style={{
                        color: employee && employee.id ? '#000000' : '#BBBBBB',
                        fontFamily: 'Arial',
                        fontSize: Dimensions.get('window').width <= 360 ? 13 : 15,
                      }}>
                      {fieldworkerText}
                    </Text>
                  </Body>
                  {employee && employee.id ? (
                    <TouchableOpacity onPress={this.deleteEmployee}>
                      <Icon name="close" style={styles.iconClose} type="MaterialIcons" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => this.goToSearchEmployee()}>
                      <Icon name="search" style={styles.iconSearch} type="MaterialIcons" />
                    </TouchableOpacity>
                  )}
                </ListItem>
              </View>
            </View>
            {validateRoles(['Admin', 'Massone']) && employee ? (
              <View>
                <View style={styles.containerAdditional}>
                  <Text style={styles.textLabel}>Additional fieldworkers</Text>
                </View>
                <View>
                  {additionalWorker &&
                    additionalWorker.length > 0 &&
                    additionalWorker.map((item, index) => {
                      const nameWorker = `${item.first_name} ${item.last_name}`;
                      return (
                        <View style={styles.containerFlexAdd}>
                          <View style={styles.flexAdditionalWorker}>
                            <View style={styles.containerNameAdditional}>
                              <Text style={styles.textAdditionalWorker}>{nameWorker}</Text>
                            </View>
                            <View style={styles.containerButtonDelete}>
                              <TouchableOpacity onPress={() => this.deleteAdditionalWorker(index)}>
                                <Icon name="close" style={styles.iconClose} type="MaterialIcons" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                </View>
                <View style={styles.containerButtonAdd}>
                  <TouchableOpacity
                    onPress={() => this.goToSearchEmployee('additional')}
                    style={styles.buttonAddWorker}>
                    <Text style={styles.textAddWorker}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
        <View style={styles.flexTwo}>
          <View style={styles.containerSwitch}>
            <View style={styles.viewSwitch}>
              <Switch
                thumbColor={job.alert_employee ? BLUE_MAIN : '#BBBBBB'}
                onValueChange={() => this.onChangeBoolean('alert_employee')}
                value={job.alert_employee}
                trackColor={{
                  true: '#CAEDFA',
                  false: '#BBBBBB',
                }}
              />
              <Text style={job.alert_employee ? styles.textSwitchActive : styles.textSwitchInative}>
                {t('JOB_EDIT.alertEmployee')}
              </Text>
            </View>
            <View style={styles.viewSwitch}>
              <Switch
                thumbColor={job.email_customer ? BLUE_MAIN : '#BBBBBB'}
                trackColor={{
                  true: '#CAEDFA',
                  false: '#BBBBBB',
                }}
                onValueChange={() => this.onChangeBoolean('email_customer')}
                value={job.email_customer}
              />
              <Text style={job.email_customer ? styles.textSwitchActive : styles.textSwitchInative}>
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
    );
  }
}

export default withNamespaces()(withNavigation(JobCreateScreen));
