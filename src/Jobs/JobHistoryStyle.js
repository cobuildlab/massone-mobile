import { StyleSheet } from 'react-native';
import { BLUE_MAIN } from '../constants/colorPalette';

export default StyleSheet.create({
  list: {
    marginTop: 10,
  },
  listItem: {
    marginLeft: 0,
    paddingLeft: 18,
  },
  viewListItem: {
    marginLeft: 5,
    marginRight: 5,
  },
  textOwner: {
    marginBottom: 5,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  textCreated: {
    marginTop: 5,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  rolesText: {
    color: BLUE_MAIN,
  },
});
