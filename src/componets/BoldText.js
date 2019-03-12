import React from 'react';
import { StyleSheet } from 'react-native';
import { BLUE_MAIN, VIOLET, GRAY_DARK } from '../constants/colorPalette';
import { Text } from 'native-base';
import { PropTypes } from 'prop-types';

const style = StyleSheet.create({
  bold: {
    fontSize: 16,
    fontWeight: '700',
    color: VIOLET,
  },
});

const BoldText = ({ children }) => <Text style={style.bold}>{children}</Text>;

BoldText.propTypes = {
  children: PropTypes.any.isRequired,
};

export default BoldText;
