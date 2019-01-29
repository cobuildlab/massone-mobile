import { StyleSheet } from 'react-native';
import { BLUE_MAIN, VIOLET, GRAY_DARK } from '../constants/colorPalette';

export default StyleSheet.create({
  list: {
    marginTop: 10,
  },
  titleHeader: {
    fontSize: 18,
  },
  listItem: {
    width: '95%',
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 10,
  },
  issueView: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  issueName: {
    fontSize: 16,
    fontWeight: '700',
    color: BLUE_MAIN,
    marginRight: 5,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: VIOLET,
    marginLeft: 5,
  },
  textDate: {
    fontSize: 14,
    color: GRAY_DARK,
    fontWeight: '700',
    marginRight: 4,
  },
  textNumDate: {
    fontSize: 14,
    marginLeft: 2,
    marginRight: 4,
  },
});
