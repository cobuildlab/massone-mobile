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
  itemMenu:{
    width: '95%', 
    paddingTop: 10, 
    paddingBottom: 10, 
    paddingLeft: 15, 
    paddingRight: 15, 
    borderBottomColor: '#3d65b0', 
    borderBottomWidth: 1, 
    marginLeft: 5, 
    marginRight: 5 
  },
  textItemMenu:{
    color: '#fff',
    fontSize: 20,
  }
});