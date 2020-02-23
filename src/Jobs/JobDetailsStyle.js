import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  // bgHeader: {
  //   backgroundColor: '#e4e4e4',
  // },
  textData: {
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 5,
  },
  jobTitleStyle: {
    color: '#537DBF',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').width <= 360 ? 18 : 19,
  },
  containerBtnOptions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  widthDouble: {
    width: '50%',
  },
  containerIssue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContainer: {
    height: '95%',
    justifyContent: 'space-around',
    padding: 15,
  },
  containerFlex: {
    flex: 1,
    height: '100%',
    // borderColor: 'red',
    // borderWidth: 1,
    padding: 12,
  },
  btnDanger: {
    borderColor: '#D75452',
    width: '44%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 5,
    borderWidth: 2,
  },
  textButtonDanger: {
    color: '#D75452',
    fontWeight: '500',
  },
  textButton: {
    color: 'white',
    fontWeight: '500',
  },
  btnPrimary: {
    borderColor: '#537DBF',
    backgroundColor: '#537DBF',
    width: '44%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 5,
    borderWidth: 2,
  },
  containerDoubleRow: {
    flexDirection: 'row',
    width: '100%',
  },
  valueContainer: {
    // paddingBottom: 14,
  },
  keyValue: {
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: Dimensions.get('window').width <= 360 ? 18 : 19,
  },
  textDataContact: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
  },
  keyTitle: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 12 : 13,
    paddingBottom: 3,
  },
  dateStyle: {
    color: '#BBBBBB',
    fontFamily: 'Roboto',
    fontSize: Dimensions.get('window').width <= 360 ? 12 : 13,
  },
  viewBtnGroup: {
    flex: 1,
    marginTop: 15,
    flexDirection: 'row',
  },
  buttonPause: {
    marginTop: 15,
  },
  viewBtn: {
    width: '49%',
  },
  btnLeft: {
    marginRight: 5,
  },
  btnRight: {
    marginLeft: 5,
  },
});
