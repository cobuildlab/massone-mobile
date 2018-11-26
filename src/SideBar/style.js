import { StyleSheet, Platform, Dimensions } from 'react-native';
var width = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#537DBf'
  },
  viewLogo:{
    width: 190,
    height:170,
    marginTop: 33,
    resizeMode: 'contain',
    ...Platform.select({
      android: {

      },
  }),
  },
  logoSideBar:{
    alignItems: 'center', 
    justifyContent: 'center'
  },
  viewBackground:{
    backgroundColor: '#fff',
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: 200,
    justifyContent: 'flex-start',
  },
});