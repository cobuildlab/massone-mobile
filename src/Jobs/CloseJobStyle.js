import { StyleSheet } from 'react-native';
import { BLUE_MAIN } from '../constants/colorPalette';

export default StyleSheet.create({
  listItemMargin: {
    marginVertical: 15,
  },
  signatureItem: {
    marginBottom: 10,
  },
  ctnBtnClose: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  containerTextWorkers: {
    marginRight: 15,
    marginBottom: 10,
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
  textFieldWorkers: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    color: 'gray',
  },
  signatureButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonMargin: {
    marginLeft: 5,
  },
  partButton: {
    marginTop: 10,
  },
  mainTextTimes: {
    marginTop: 10,
  },
  textTimes: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: BLUE_MAIN,
  },
});
