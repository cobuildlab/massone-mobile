import { StyleSheet } from 'react-native';
import {
  BLUE_MAIN,
  WHITE_MAIN,
  BLUE_SECONDARY,
} from '../constants/colorPalette';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE_MAIN,
  },
  viewLogo: {
    width: 190,
    height: 170,
    marginTop: 33,
    resizeMode: 'contain',
  },
  logoSideBar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBackground: {
    backgroundColor: WHITE_MAIN,
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: 200,
    justifyContent: 'flex-start',
  },
  itemMenu: {
    width: '95%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomColor: BLUE_SECONDARY,
    borderBottomWidth: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  textItemMenu: {
    color: WHITE_MAIN,
    fontSize: 20,
  },
});
