import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Spinner } from 'native-base';

const styles = StyleSheet.create({
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
    zIndex: 999999,
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

class Loading extends Component {
  render() {
    return (
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <Spinner color={'blue'}/>
          </View>
        </View>
    )
  }
}

export default Loading;
