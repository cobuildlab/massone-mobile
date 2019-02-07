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
  issueView: {
    flexDirection: 'row',
  },
  issueName: {
    fontSize: 16,
    fontWeight: '700',
    color: BLUE_MAIN,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: VIOLET,
  },
  textDate: {
    fontSize: 14,
    color: GRAY_DARK,
    fontWeight: '700',
  },
  textNumDate: {
    fontSize: 14,
  },
});
