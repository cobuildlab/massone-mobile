import { StyleSheet, Dimensions } from 'react-native';
import { BLUE_MAIN, VIOLET } from '../constants/colorPalette';

export default StyleSheet.create({
  // bgHeader: {
  //   backgroundColor: '#e4e4e4',
  // },
  titleHeader: {
    fontSize: 18,
  },
  textValue: {
    color: '#BBBBBB',
    fontFamily: 'Roboto',
    fontSize: Dimensions.get('window').width <= 360 ? 10 : 12,
  },
  containerField: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 20,
    alignItems: 'center',
  },
  containerKey: {
    width: '25%',
    marginLeft: 15,
  },
  containerValue: {
    width: '75%',
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
  textNumDate: {
    fontSize: 14,
    marginLeft: 2,
    marginRight: 4,
  },
  textData: {
    fontSize: Dimensions.get('window').width <= 360 ? 16 : 18,
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
});
