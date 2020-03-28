import React from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Icon, Card } from 'native-base';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import styles from './styles';
import stylesLast from '../JobDetailsStyle';

const LastFiveJobs = (props) => {
  const { modalVisible, setModal, jobs, t } = props;
  return (
    <Modal animationType="fade" transparent visible={modalVisible}>
      <View style={styles.containerModal}>
        <View style={styles.modalLastJob}>
          <View style={styles.containerTextTitle}>
            <Text style={styles.textLastJobs}>The last five jobs</Text>
            <TouchableOpacity style={styles.buttonClose} onPress={() => setModal(false)}>
              <Icon style={{ color: 'gray', fontSize: 40 }} name="close" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              marginBottom: 20,
            }}>
            <ScrollView contentContainerStyle={styles.containerScrollModal}>
              {jobs.length > 0 ? (
                jobs.map((item, ix) => {
                  const { employee } = item;
                  const created = item.date_start
                    ? moment(item.date_start)
                      .tz(moment.tz.guess())
                      .format('LLLL')
                    : t('JOBS.notProvided');
                  const threePoints =
                    item.description && item.description.length > 200 ? '...' : '';
                  const description =
                    item.description && item.description.substr(0, 201) + threePoints;
                  const completionNotes = item.completion_notes && item.completion_notes;
                  return (
                    <View key={ix}>
                      <Card style={stylesLast.cardContainer}>
                        <View style={stylesLast.marginSpace}>
                          <View style={stylesLast.containerIssue}>
                            <Text style={stylesLast.keyTitle}>{t('JOBS.issue')}</Text>
                            <Text style={stylesLast.keyTitle}>{created}</Text>
                          </View>
                          <View style={stylesLast.valueContainer}>
                            <Text style={stylesLast.jobTitleStyle}>{item.title}</Text>
                          </View>
                        </View>
                        <View style={stylesLast.marginSpace}>
                          <View>
                            <Text style={stylesLast.keyTitle}>{t('JOBS.description')}</Text>
                          </View>
                          <View style={stylesLast.valueContainer}>
                            <Text style={stylesLast.keyValue}>{description}</Text>
                          </View>
                        </View>
                        <View style={stylesLast.containerDoubleRow}>
                          <View style={stylesLast.widthDouble}>
                            <Text style={stylesLast.keyTitle}>{t('JOBS.startDate')}</Text>
                            <Text style={stylesLast.keyValue}>
                              {item.date_start
                                ? moment(item.date_start).format('DD | MMM | YYYY')
                                : t('JOBS.notProvided')}
                            </Text>
                          </View>
                          <View style={stylesLast.widthDouble}>
                            <Text style={stylesLast.keyTitle}>{t('JOBS.endDate')}</Text>
                            <Text style={stylesLast.keyValue}>
                              {item.date_finish
                                ? moment(item.date_finish).format('DD | MMM | YYYY')
                                : t('JOBS.notProvided')}
                            </Text>
                          </View>
                        </View>
                        {item.completion_notes.length > 0 && (
                          <View style={stylesLast.marginSpace}>
                            <View>
                              <Text style={stylesLast.keyTitle}>{t('JOBS.completionNotes')}</Text>
                            </View>
                            <View style={[stylesLast.valueContainer, { flexDirection: 'row' }]}>
                              <Text style={stylesLast.keyValue}>{completionNotes}</Text>
                            </View>
                          </View>
                        )}
                        <View style={stylesLast.marginSpace}>
                          <View>
                            <Text style={stylesLast.keyTitle}>{t('JOBS.fieldworker')}</Text>
                          </View>
                          <View style={[stylesLast.valueContainer, { flexDirection: 'row' }]}>
                            <Text style={stylesLast.keyValue}>
                              {employee ? (
                                <>{`${employee.first_name} ${employee.last_name}`}</>
                              ) : (
                                'Not assigned'
                              )}
                            </Text>
                          </View>
                        </View>
                      </Card>
                    </View>
                  );
                })
              ) : (
                <View style={styles.containerNoLast}>
                  <Text style={styles.textLastJobs}>No last jobs were found</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

LastFiveJobs.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
  jobs: PropTypes.any.isRequired,
  t: PropTypes.any.isRequired,
};

export default LastFiveJobs;
