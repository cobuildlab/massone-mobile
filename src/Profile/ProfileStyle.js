import { StyleSheet } from 'react-native';
import { BLUE_MAIN, VIOLET, GRAY_DARK } from '../constants/colorPalette';

export default StyleSheet.create({
  // bgHeader: {
  //   backgroundColor: '#e4e4e4',
  // },
  titleHeader: {
    fontSize: 18,
  },
  listItem: {
    width: '95%',
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 10,
  },
  issueName: {
    fontSize: 16,
    fontWeight: '700',
    color: BLUE_MAIN,
    marginRight: 5,
    marginBottom: 3,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: VIOLET,
    marginLeft: 5,
    marginBottom: 3,
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
  textData: {
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 5,
  },
});
