import { StyleSheet, Dimensions } from 'react-native';
import { BLUE_MAIN } from '../constants/colorPalette';

export default StyleSheet.create({
  list: {
    marginTop: 10,
  },
  listItem: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  viewListItem: {
    // marginHorizontal: 5,
  },
  containerOwner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textActionHistory: {
    fontFamily: 'Roboto',
    color: '#000000',
    fontSize: Dimensions.get('window').width <= 360 ? 15 : 16,
  },
  textOwner: {
    marginBottom: 2,
    color: BLUE_MAIN,
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: Dimensions.get('window').width <= 360 ? 17 : 18,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  iconEmployeAndLocation: {
    color: BLUE_MAIN,
    marginRight: 3,
    fontSize: Dimensions.get('window').width <= 360 ? 18 : 20,
  },
  textCreated: {
    marginTop: 5,
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 11 : 12,
    fontFamily: 'Roboto',
    // textAlign: 'right',
    // alignSelf: 'flex-end',
  },
  rolesMainText: {
    marginBottom: 5,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  rolesText: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 11 : 12,
    fontFamily: 'Roboto',
  },
});
