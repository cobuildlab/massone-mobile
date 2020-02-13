import { StyleSheet } from 'react-native';
import { BLUE_MAIN, WHITE_MAIN } from '../constants/colorPalette';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE_MAIN,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewLogo: {
    width: 190,
    height: 170,
    marginTop: 33,
    resizeMode: 'contain',
  },
  iconMenu: {
    fontSize: 20,
    color: '#fff',
    paddingRight: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: '500',
  },
  buttonLogout: {
    flexDirection: 'row',
    paddingHorizontal: 27,
    paddingVertical: 10,
    // borderColor: 'red',
    // borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLogout: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconLogout: {
    color: 'white',
    fontSize: 25,
    marginRight: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  textItemMenu: {
    color: WHITE_MAIN,
    fontSize: 20,
  },
});
