import { StyleSheet, Dimensions } from 'react-native';
import { BLUE_MAIN } from '../../constants/colorPalette';

const styles = StyleSheet.create({
  containerContent: {
    flex: 1.5,
    // borderWidth: 1,
    paddingHorizontal: 20,
    // borderColor: 'red',
  },
  containerAdditional: {
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCloseModal: {
    color: 'gray',
    fontSize: Dimensions.get('window').width > 415 ? 40 : 35,
  },
  containerScrollModal: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  buttonClose: {
    top: 6,
    position: 'absolute',
    left: 205,
  },
  containerTextTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  textLastJobs: {
    color: '#537DBF',
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').width <= 360 ? 18 : 19,
  },
  textLast: {
    color: '#537DBF',
    textDecorationLine: 'underline',
    marginTop: 15,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').width <= 360 ? 15 : 16,
  },
  containerNoLast: {
    marginTop: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLastJob: {
    borderRadius: 20,
    height: '90%',
    backgroundColor: '#F1F5F7',
    width: '93%',
    alignItems: 'center',
  },
  containerModal: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: 'gray',
    justifyContent: 'center',
  },
  containerButtonAdd: {
    alignItems: 'center',
    marginBottom: 15,
  },
  containerFlexAdd: {
    marginBottom: 20,
  },
  containerButtonDelete: {
    width: '11%',
  },
  containerNameAdditional: {
    width: '89%',
  },
  textAddWorker: {
    color: 'white',
  },
  flexOne: {
    // flex: 2,
    marginTop: 13,
  },
  flexAdditionalWorker: {
    flexDirection: 'row',
    width: '100%',
  },
  textAdditionalWorker: {
    color: '#000000',
    fontFamily: 'Arial',
    fontSize: Dimensions.get('window').width <= 360 ? 13 : 15,
  },
  pickerStyle: {
    width:
      Dimensions.get('window').width <= 360
        ? 200
        : Dimensions.get('window').width >= 400
          ? 245
          : 225,
    marginVertical: 2,
  },
  fieldsText: {
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  fieldsTextSelects: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  containerTextDownSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextDownSlider: {
    color: '#BBBBBB',
    fontFamily: 'Arial',
    fontSize: Dimensions.get('window').width <= 360 ? 7 : 9,
  },
  TextDownSliderActive: {
    color: BLUE_MAIN,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: Dimensions.get('window').width <= 360 ? 7 : 9,
  },
  containerTextSlider: {
    width: '24%',
  },
  containerSlider: {
    width: '76%',
  },
  fieldsSliderAndText: {
    flexDirection: 'row',
    width: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  textLabel: {
    color: '#BBBBBB',
    fontFamily: 'Roboto',
    fontSize: Dimensions.get('window').width <= 360 ? 10 : 13,
  },
  textLabelDate: {
    color: '#000000',
    fontSize: Dimensions.get('window').width <= 360 ? 16 : 18,
  },
  textLabelDateGray: {
    color: '#BBBBBB',
    fontFamily: 'Roboto',
    fontSize: Dimensions.get('window').width <= 360 ? 16 : 18,
  },
  textValueInput: {
    color: '#000000',
    fontFamily: 'Arial',
    fontSize: Dimensions.get('window').width <= 360 ? 13 : 15,
  },
  flexTwo: {
    flex: 0.32,
    paddingHorizontal: 20,
    // borderColor: 'green',
    justifyContent: 'space-around',
    alignItems: 'center',
    // borderWidth: 2,
  },
  //buttons
  containerButtonsBotton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonCancel: {
    borderColor: '#D75452',
    width: '44%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: Dimensions.get('window').width <= 360 ? 8 : 12,
    borderWidth: 2,
  },
  buttonAddWorker: {
    backgroundColor: BLUE_MAIN,
    paddingVertical: 6,
    marginLeft: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  buttonSave: {
    borderColor: BLUE_MAIN,
    backgroundColor: BLUE_MAIN,
    width: '44%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: Dimensions.get('window').width <= 360 ? 8 : 12,
    borderWidth: 2,
  },
  textButtonCancel: {
    color: '#D75452',
    fontWeight: '500',
  },
  textButtonSave: {
    color: 'white',
    fontWeight: '500',
  },
  textSwitchActive: {
    marginLeft: 7,
    fontSize: Dimensions.get('window').width <= 360 ? 11 : 12,
  },
  textSwitchInative: {
    marginLeft: 7,
    fontSize: Dimensions.get('window').width <= 360 ? 11 : 12,
    color: '#BBBBBB',
  },
  containerSwitch: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  borderNonePicker: {
    borderColor: 'transparent',
  },
  viewSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSearch: {
    fontSize: Dimensions.get('window').width <= 360 ? 17 : 21,
    color: BLUE_MAIN,
  },
  iconClose: {
    fontSize: Dimensions.get('window').width <= 360 ? 17 : 21,
    color: '#D75452',
  },
});

export default styles;
