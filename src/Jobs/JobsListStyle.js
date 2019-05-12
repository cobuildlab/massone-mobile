import { StyleSheet } from 'react-native';
import { BLUE_MAIN, VIOLET, GRAY_DARK } from '../constants/colorPalette';

export default StyleSheet.create({
  list: {
    marginTop: 1,
  },
  titleHeader: {
    fontSize: 18,
  },
  listItem: {
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  textLeft: {
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  issueName: {
    fontWeight: '700',
    color: BLUE_MAIN,
  },
  fieldworkerName: {
    fontWeight: '700',
    color: VIOLET,
  },
  textGray: {
    color: GRAY_DARK,
    fontWeight: '700',
  },
});
