import React from 'react';
import { StyleSheet } from 'react-native';
import { BLUE_MAIN } from '../../../constants/colorPalette';
import { Text } from 'native-base';
import { PropTypes } from 'prop-types';

const style = StyleSheet.create({
  text: {
    fontWeight: '700',
    color: BLUE_MAIN,
  },
});

const H2 = ({ children }) => <Text style={style.text}>{children}</Text>;

H2.propTypes = {
  children: PropTypes.any.isRequired,
};

export { H2 };
