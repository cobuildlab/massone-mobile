import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './JobDetailsStyle';

const ReasonComments = (props) => {
  const { pausedInfo, t } = props;
  return (
    <View style={styles.marginSpace}>
      <View>
        <Text style={styles.jobPausedStyle}>{t('JOBS.jobPausedTitle')}</Text>
      </View>
      {pausedInfo && pausedInfo.status === 'Paused' ? (
        <>
          <View style={styles.marginSpace}>
            <Text style={styles.keyTitle}>{t('JOBS.reason')}</Text>
            <View style={[styles.valueContainer, { flexDirection: 'row' }]}>
              <Text style={styles.keyValue}>
                {pausedInfo.reason ? pausedInfo.reason : t('JOBS.notProvided')}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.keyTitle}>{t('JOBS.comment')}</Text>
          </View>
          <View style={[styles.valueContainer, { flexDirection: 'row' }]}>
            <Text style={styles.keyValue}>
              {pausedInfo.comment ? pausedInfo.comment : t('JOBS.notProvided')}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
};

ReasonComments.propTypes = {
  pausedInfo: PropTypes.object.isRequired,
  t: PropTypes.any.isRequired,
};

export default ReasonComments;
