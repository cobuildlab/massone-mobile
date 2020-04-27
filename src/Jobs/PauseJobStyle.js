import { StyleSheet } from 'react-native';
import { BLUE_MAIN } from '../constants/colorPalette';

export default StyleSheet.create({
  content: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  viewText: {
    marginTop: 40,
  },
  text: {
    color: BLUE_MAIN,
    textAlign: 'center',
  },
  textCount: {
    textAlign: 'right',
    marginTop: 5,
    color: 'gray',
    fontSize: 14,
  },
  textJob: {
    textAlign: 'center',
  },
  viewTextArea: {
    marginTop: 30,
    marginBottom: 30,
  },
  button: {
    alignSelf: 'center',
  },
  pauseReasonPicker: {
    width: undefined,
    marginTop: 30,
  },
});
