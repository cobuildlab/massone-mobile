import React from 'react';
import { StyleSheet } from 'react-native';
import { GRAY_DARK } from '../../../constants/colorPalette';
import { Text } from 'native-base';
import { PropTypes } from 'prop-types';

const style = StyleSheet.create({
  text: {
    color: GRAY_DARK,
  },
});

const SubTitle = ({ children }) => <Text style={style.text}>{children}</Text>;

SubTitle.propTypes = {
  children: PropTypes.any.isRequired,
};

export { SubTitle };
