import { StyleSheet, Platform, Dimensions } from 'react-native';
var width = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLogo:{
    width: 220,
    height: 200,
    marginBottom: '10%',
    marginTop: -20,
    resizeMode: 'contain',
    ...Platform.select({
      android: {
        marginTop: '20%',
      },
  }),
  },
  viewBackground:{
    backgroundColor: '#fff',
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  title:{
    fontSize: 36,
    marginBottom: 8,
    color: '#fff',
    fontWeight: 'bold'
  },
  subTitle:{
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
    fontWeight: 'bold'
  },
  subTitleForgot:{
    fontSize: 10,
    marginBottom: 5,
    color: '#fff',
    fontWeight: 'bold'
  },
  inputLogin:{
    width: '100%',
    backgroundColor: '#ffffff82', 
    color: '#fff',
    borderRadius: 10, 
    height: 40, 
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  textBtn:{
    color: '#fff', 
    fontWeight: 'bold',
  }
});