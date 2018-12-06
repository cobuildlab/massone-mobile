import { StyleSheet } from 'react-native';
import { BLUE_MAIN } from '../constants/colorPalette';

export default StyleSheet.create({
  item: {
    marginLeft: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  iconBlue: {
    color: BLUE_MAIN,
  },
  thumbnail: {
    marginLeft: 5,
    marginBottom: 5,
  },
  imageView: {
    width: 60,
  },
  iconClose: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
