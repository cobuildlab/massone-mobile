import React from 'react';
import { StyleSheet } from 'react-native';
import { GRAY_DARK } from '../../../constants/colorPalette';
import { Text } from 'native-base';
import { PropTypes } from 'prop-types';

const style = StyleSheet.create({
  text: {
    fontWeight: '700',
    color: GRAY_DARK,
  },
});

const H3 = ({ children }) => <Text style={style.text}>{children}</Text>;

H3.propTypes = {
  children: PropTypes.any.isRequired,
};

export { H3 };
