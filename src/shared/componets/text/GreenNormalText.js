import React from 'react';
import { StyleSheet } from 'react-native';
import { GREEN } from '../../../constants/colorPalette';
import { Text } from 'native-base';
import { PropTypes } from 'prop-types';

const style = StyleSheet.create({
  text: {
    color: GREEN,
  },
});

const GreenNormalText = ({ children }) => (
  <Text style={style.text}>{children}</Text>
);

GreenNormalText.propTypes = {
  children: PropTypes.any.isRequired,
};

export { GreenNormalText };
