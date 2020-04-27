import React from 'react';
import PropTypes from 'prop-types';
import styles from './JobDetailsStyle';
import { View, TouchableOpacity, Text } from 'react-native';
const JobDetailOptions = (props) => {
  const {
    t,
    job,
    emailLoggedIn,
    acceptJob,
    startDrive,
    endDrive,
    startJob,
    goToPauseJob,
    goToCloseJob,
  } = props;
  return job.status &&
    job.employee.email === emailLoggedIn &&
    // job.status !== 'Paused' &&
    job.status !== 'Closed' ? (
      <>
        <View style={styles.containerBtnOptions}>
          {job.status === 'Dispatch' ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={acceptJob}>
              <Text style={styles.textButton}>{t('JOBS.acceptJob')}</Text>
            </TouchableOpacity>
          ) : null}
          {job.status === 'Accept' ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={startDrive}>
              <Text style={styles.textButton}>{t('JOBS.startDrive')}</Text>
            </TouchableOpacity>
          ) : null}
          {job.status === 'Start Drive Time' ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={endDrive}>
              <Text style={styles.textButton}>{t('JOBS.endDrive')}</Text>
            </TouchableOpacity>
          ) : null}
          {job.status === 'End Drive Time' || job.status === 'Paused' ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={startJob}>
              <Text style={styles.textButton}>{t('JOBS.startJob')}</Text>
            </TouchableOpacity>
          ) : null}
          {job.status === 'Start' || job.status === 'Started' ? (
            <TouchableOpacity style={styles.btnDanger} onPress={goToPauseJob}>
              <Text style={styles.textButtonDanger}>{t('JOBS.pauseJob')}</Text>
            </TouchableOpacity>
          ) : null}
          {job.status === 'Start' || job.status === 'Started' ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={goToCloseJob}>
              <Text style={styles.textButton}>{t('JOBS.closeJob')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </>
    ) : null;
};

JobDetailOptions.propTypes = {
  job: PropTypes.object.isRequired,
  emailLoggedIn: PropTypes.string.isRequired,
  acceptJob: PropTypes.func.isRequired,
  startDrive: PropTypes.func.isRequired,
  endDrive: PropTypes.func.isRequired,
  startJob: PropTypes.func.isRequired,
  goToPauseJob: PropTypes.func.isRequired,
  goToCloseJob: PropTypes.func.isRequired,
  t: PropTypes.any.isRequired,
};

export default JobDetailOptions;
