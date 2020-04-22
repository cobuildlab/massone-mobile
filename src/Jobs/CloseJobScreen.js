import React, { Component } from 'react';
import { Alert, RefreshControl, TouchableOpacity } from 'react-native';
import {
  Content,
  Container,
  Button,
  Text,
  Form,
  Item,
  Input,
  Label,
  ListItem,
  CheckBox,
  Body,
  View,
  Icon,
  Picker,
} from 'native-base';
import { BLUE_MAIN } from '../constants/colorPalette';
import { CustomHeader, Loading } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import authStore from '../Auth/authStore';
import { LOG } from '../utils';
import styles from './CloseJobStyle';
import moment from 'moment';

class CloseJobScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRefreshing: false,
      job: props.navigation.getParam('job', {}),
      /*
      Service order form
       */
      equipment: '',
      completionNotes: '',
      workCompleted: false,
      workPerformed: '',
      parts: [],
      laborHours: 0,
      laborOvertime: 0,
      materials: '',
      equipmentUsed: '',
      refrigerantInventory: '',
      signature: '',
      jobTimes: {},
      selectedHoursLabor: 0,
      selectedMinutesLabor: 0,
      selectedHoursLaborOvertime: 0,
      selectedMinutesLaborOvertime: 0,
      additionalWorkersEntry: props.navigation.getParam('additionalWorkersEntry', []),
      selectHourAdditional: [],
      selectMinutesAdditional: [],
      worked_hours_additional: [], //array final hours to send
      /*
      Service order form
       */
    };
  }

  componentDidMount() {
    const { additionalWorkersEntry, job } = this.state;
    this.closeJobSubscription = jobStore.subscribe('CloseJob', this.closeJobHandler);
    this.getJobTimesSubscription = jobStore.subscribe('GetJobTimes', this.getJobTimesHandler);
    this.selectPartSubscription = jobStore.subscribe('SelectPart', this.selectPartHandler);
    this.signatureSubscription = jobStore.subscribe('Signature', this.signatureHandler);
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.loadData();
    // preparing array of additional workers to send
    const workers = additionalWorkersEntry.map((res) => {
      return {
        id: res.id_doc,
        job: job.id,
        employee: res.id,
        worked_hours: 0,
      };
    });
    // start selects additional workers and minutes
    const hourSelect = additionalWorkersEntry.map(() => {
      return {
        selectHour: 0,
      };
    });
    const minutesSelect = additionalWorkersEntry.map(() => {
      return {
        selectMinute: 0,
      };
    });
    this.setState({
      worked_hours_additional: workers,
      selectHourAdditional: hourSelect,
      selectMinutesAdditional: minutesSelect,
    });
  }

  componentWillUnmount() {
    this.closeJobSubscription.unsubscribe();
    this.getJobTimesSubscription.unsubscribe();
    this.selectPartSubscription.unsubscribe();
    this.signatureSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  closeJobHandler = () => {
    this.setState({ isLoading: false });
    this.props.navigation.goBack();
  };

  getJobTimesHandler = (jobTimes) => {
    this.setState({ jobTimes, isRefreshing: false });
  };

  selectPartHandler = (part) => {
    this.selectPart(part);
  };

  signatureHandler = (signature) => {
    this.setState({ signature });
  };

  errorHandler = () => {
    this.setState({ isLoading: false, isRefreshing: false });
  };

  hoursSet = () => {
    return Array.from(Array(25), (e, val) => {
      let valItera = val;
      return <Picker.Item key={valItera} label={`${valItera} hour`} value={valItera} />;
    });
  };

  minSet = () => {
    return Array.from(Array(12), (e, val) => {
      const valItera = val * 5;
      return (
        <Picker.Item
          key={valItera}
          label={`${valItera} min`}
          value={parseFloat(parseFloat(valItera / 60).toFixed(2))}
        />
      );
    });
  };

  render() {
    const { t } = this.props;
    const {
      selectedHoursLabor,
      selectedMinutesLabor,
      selectedHoursLaborOvertime,
      selectedMinutesLaborOvertime,
      additionalWorkersEntry,
      job,
      selectHourAdditional,
      selectMinutesAdditional,
      worked_hours_additional,
      // laborHours,
    } = this.state;
    // console.log('Hours select per first fieldworker ',laborHours);
    console.log('Hours select per additional worker ', worked_hours_additional);
    const emailLoggedIn = authStore.getState('Login') && authStore.getState('Login').email;
    console.log('User logueado ', emailLoggedIn);
    console.log('JOB employeee ', job.employee.email);
    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.closeJob')} />

        <Content
          refreshControl={
            <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refreshData} />
          }>
          <Form>
            <Item stackedLabel>
              <Label>{t('JOBS.equipment')}</Label>
              <Input
                value={this.state.equipment}
                placeholder={t('JOBS.equipmentPlaceHolder')}
                onChangeText={(equipment) => this.setState({ equipment })}
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.completionNotes')}</Label>
              <Input
                value={this.state.completionNotes}
                placeholder={t('JOBS.completionNotesPlaceholder')}
                onChangeText={(completionNotes) => this.setState({ completionNotes })}
              />
            </Item>
            <ListItem
              button
              onPress={() => this.setState({ workCompleted: !this.state.workCompleted })}>
              <CheckBox
                onPress={() => this.setState({ workCompleted: !this.state.workCompleted })}
                style={styles.listItemMargin}
                checked={this.state.workCompleted}
                color={BLUE_MAIN}
              />
              <Body>
                <Text>{t('JOBS.workCompleted')}</Text>
              </Body>
            </ListItem>
            <Item stackedLabel>
              <Label>{t('JOBS.workPerformed')}</Label>
              <Input
                value={this.state.workPerformed}
                placeholder={t('JOBS.workPerformedPlaceholder')}
                onChangeText={(workPerformed) => this.setState({ workPerformed })}
              />
            </Item>
            <ListItem button noIndentBodyText onPress={this.goToSearchParts}>
              <Body>
                <Text>{t('JOBS.partsPlaceholder')}</Text>
                {Array.isArray(this.state.parts)
                  ? this.state.parts.map((part) => (
                    <Button
                      title={'DELETE PART'}
                      key={part.id}
                      onPress={() => this.deletePart(part)}
                      style={styles.partButton}
                      primary
                      iconRight
                      transparent>
                      <Text>{part.item}</Text>
                      <Icon name="md-close" />
                    </Button>
                  ))
                  : null}
              </Body>
              <Button
                title={'SEARCH PART'}
                onPress={this.goToSearchParts}
                style={styles.listItemMargin}
                primary>
                <Text>{t('JOBS.search')}</Text>
              </Button>
            </ListItem>
            <Item stackedLabel>
              {this.showTimes() ? (
                <Text style={styles.mainTextTimes}>
                  {this.state.jobTimes.start_drive_time ? (
                    <Text style={styles.textTimes} note>
                      {`${t('JOBS.driveStarted')}: `}
                      {moment
                        .duration(
                          moment
                            .utc(this.state.jobTimes.start_drive_time)
                            .diff(moment.utc(), 'seconds'),
                          'seconds',
                        )
                        .humanize(true)}
                    </Text>
                  ) : null}
                  {this.state.jobTimes.end_drive_time ? (
                    <Text style={styles.textTimes} note>
                      {this.state.jobTimes.start_drive_time ? ', ' : ''}
                      {`${t('JOBS.driveEnded')}: `}
                      {moment
                        .duration(
                          moment
                            .utc(this.state.jobTimes.end_drive_time)
                            .diff(moment.utc(), 'seconds'),
                          'seconds',
                        )
                        .humanize(true)}
                    </Text>
                  ) : null}
                  {this.state.jobTimes.start_time ? (
                    <Text style={styles.textTimes} note>
                      {this.state.jobTimes.end_drive_time ? ', ' : ''}
                      {`${t('JOBS.jobStarted')}: `}
                      {moment
                        .duration(
                          moment.utc(this.state.jobTimes.start_time).diff(moment.utc(), 'seconds'),
                          'seconds',
                        )
                        .humanize(true)}
                    </Text>
                  ) : null}
                </Text>
              ) : null}
              {additionalWorkersEntry.length > 0 && (
                <>
                  <View style={styles.containerTextWorkers}>
                    <Text style={styles.textFieldWorkers}>Fieldworkers</Text>
                  </View>
                  <Text
                    style={{
                      marginRight: 10,
                    }}>
                    {`${job.employee.first_name} ${job.employee.last_name}`}
                  </Text>
                </>
              )}
              <Label>{t('JOBS.laborHoursLabel')}</Label>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Picker
                  mode="dropdown"
                  iosHeader="Select hour"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  selectedValue={selectedHoursLabor}
                  onValueChange={(hour) => {
                    this.setState({
                      selectedHoursLabor: hour,
                      laborHours: `${parseInt(hour) + parseFloat(selectedMinutesLabor)}`,
                    });
                  }}>
                  {this.hoursSet()}
                </Picker>
                <Picker
                  mode="dropdown"
                  iosHeader="Select min"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  selectedValue={selectedMinutesLabor}
                  onValueChange={(min) => {
                    this.setState({
                      selectedMinutesLabor: min,
                      laborHours: `${parseInt(selectedHoursLabor) + parseFloat(min)}`,
                    });
                  }}>
                  {this.minSet()}
                </Picker>
              </View>
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.laborOvertime')}</Label>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Picker
                  mode="dropdown"
                  iosHeader="Select hour"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  selectedValue={selectedHoursLaborOvertime}
                  onValueChange={(hour) => {
                    this.setState({
                      selectedHoursLaborOvertime: hour,
                      laborOvertime: `${parseInt(hour) + parseFloat(selectedMinutesLaborOvertime)}`,
                    });
                  }}>
                  {this.hoursSet()}
                </Picker>
                <Picker
                  mode="dropdown"
                  iosHeader="Select min"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  selectedValue={selectedMinutesLaborOvertime}
                  onValueChange={(min) => {
                    this.setState({
                      selectedMinutesLaborOvertime: min,
                      laborOvertime: `${parseInt(selectedHoursLaborOvertime) + parseFloat(min)}`,
                    });
                  }}>
                  {this.minSet()}
                </Picker>
              </View>
            </Item>
            {emailLoggedIn === job.employee.email
              ? selectHourAdditional.length > 0 &&
                additionalWorkersEntry.map((res, ix) => {
                  const nameFull = `${res.first_name} ${res.last_name}`;
                  return (
                    <>
                      <Text
                        style={{
                          textAlign: 'center',
                          marginTop: 10,
                        }}>
                        {nameFull}
                      </Text>
                      <Item stackedLabel>
                        <Label>{t('JOBS.laborHoursLabel')}</Label>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Picker
                            mode="dropdown"
                            iosHeader="Select hour"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{ width: undefined }}
                            selectedValue={selectHourAdditional[ix].selectHour}
                            onValueChange={(hour) => {
                              const newHour = selectHourAdditional;
                              newHour[ix].selectHour = hour;
                              const newWorked_hours = worked_hours_additional;
                              newWorked_hours[ix].worked_hours =
                                parseInt(hour) +
                                parseFloat(selectMinutesAdditional[ix].selectMinute);
                              this.setState({
                                selectHourAdditional: newHour,
                                worked_hours_additional: newWorked_hours,
                              });
                            }}>
                            {this.hoursSet()}
                          </Picker>
                          <Picker
                            mode="dropdown"
                            iosHeader="Select min"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{ width: undefined }}
                            selectedValue={selectMinutesAdditional[ix].selectMinute}
                            onValueChange={(min) => {
                              const newMin = selectMinutesAdditional;
                              newMin[ix].selectMinute = min;
                              const newWorked_hours = worked_hours_additional;
                              newWorked_hours[ix].worked_hours =
                                parseInt(selectHourAdditional[ix].selectHour) + parseFloat(min);
                              this.setState({
                                selectMinutesAdditional: newMin,
                                worked_hours_additional: newWorked_hours,
                              });
                            }}>
                            {this.minSet()}
                          </Picker>
                        </View>
                      </Item>
                    </>
                  );
                })
              : null}
            <Item stackedLabel>
              <Label>{t('JOBS.materials')}</Label>
              <Input
                value={this.state.materials}
                placeholder={t('JOBS.materialsPlaceholder')}
                onChangeText={(materials) => this.setState({ materials })}
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.equipmentUsed')}</Label>
              <Input
                value={this.state.equipmentUsed}
                placeholder={t('JOBS.equipmentUsedPlaceholder')}
                onChangeText={(equipmentUsed) => this.setState({ equipmentUsed })}
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.refrigerantInventory')}</Label>
              <Input
                value={this.state.refrigerantInventory}
                placeholder={t('JOBS.refrigerantInventoryPlaceholder')}
                onChangeText={(refrigerantInventory) => this.setState({ refrigerantInventory })}
              />
            </Item>
            <ListItem
              style={styles.signatureItem}
              button
              noBorder
              noIndentBodyText
              onPress={this.goToSignature}>
              <Body>
                <Text>{t('JOBS.signature')}</Text>
              </Body>
              {this.state.signature ? (
                <View style={styles.signatureButtons}>
                  <Button title={'Edit'} onPress={this.goToSignature} danger>
                    <Text>{t('JOBS.edit')}</Text>
                  </Button>
                  <Button
                    title={'View'}
                    style={styles.buttonMargin}
                    onPress={this.goToViewImage}
                    primary>
                    <Text>{t('JOBS.view')}</Text>
                  </Button>
                </View>
              ) : (
                <Button title={'Sign'} onPress={this.goToSignature} primary>
                  <Text>{t('JOBS.add')}</Text>
                </Button>
              )}
            </ListItem>
          </Form>
        </Content>
        <View style={styles.ctnBtnClose}>
          <TouchableOpacity style={styles.btnPrimary} onPress={this.closeJob}>
            <Text style={styles.textButton}>{t('JOBS.closeJob')}</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  loadData = () => {
    this.getJobTimes();
  };

  refreshData = () => {
    this.setState({ isRefreshing: true }, () => {
      this.getJobTimes();
    });
  };

  showTimes = () => {
    return (
      this.state.jobTimes &&
      (this.state.jobTimes.start_drive_time ||
        this.state.jobTimes.end_drive_time ||
        this.state.jobTimes.start_time)
    );
  };

  getJobTimes = () => {
    if (!this.state.job || !this.state.job.id) return;
    jobActions.getJobTimes(this.state.job.id);
  };

  goToSignature = () => {
    this.props.navigation.navigate('Signature');
  };

  selectPart = (part) => {
    if (!part) return;

    let alreadyIn = false;
    for (const partIn of this.state.parts) {
      if (part.id === partIn.id) {
        alreadyIn = true;
        break;
      }
    }

    if (!alreadyIn) {
      const parts = this.state.parts;
      parts.push(part);
      this.setState({ parts });
    }
  };

  deletePart = (part) => {
    if (!part) return;

    const parts = this.state.parts.filter((partIn) => part.id !== partIn.id);

    this.setState({ parts });
  };

  goToSearchParts = () => {
    this.props.navigation.navigate('SearchParts');
  };

  goToViewImage = () => {
    if (!this.state.signature) return;
    this.props.navigation.navigate('Image', {
      image: {
        image_comment: `data:image/jpeg;base64,${this.state.signature}`,
      },
    });
  };

  closeJob = () => {
    const { worked_hours_additional } = this.state;
    if (!this.state.job || !this.state.job.title) return;

    Alert.alert(this.props.t('JOBS.wantToCloseJob'), this.state.job.title, [
      {
        text: this.props.t('APP.cancel'),
        onPress: () => {
          LOG(this, 'Cancel closeJob');
        },
      },
      {
        text: this.props.t('JOBS.close'),
        onPress: () => {
          this.setState({ isLoading: true }, () => {
            jobActions.closeJob(
              this.state.job.id,
              this.state.equipment || null,
              this.state.completionNotes || null,
              this.state.workCompleted,
              this.state.workPerformed,
              this.state.parts.map((part) => part.id),
              Number(this.state.laborHours),
              Number(this.state.laborOvertime) || 0,
              this.state.materials || null,
              this.state.equipmentUsed || null,
              this.state.refrigerantInventory || null,
              this.state.signature,
              parseFloat(this.state.laborHours),
              parseFloat(this.state.laborOvertime) || 0,
              worked_hours_additional,
            );
          });
        },
      },
    ]);
  };
}

export default withNamespaces()(CloseJobScreen);
