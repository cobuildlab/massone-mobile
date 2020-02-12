import { StyleSheet, Dimensions } from 'react-native';
import { BLUE_MAIN } from '../../constants/colorPalette';

const styles = StyleSheet.create({
  containerContent: {
    flex: 1,
    // borderWidth: 1,
    paddingHorizontal: 18,
    // borderColor: 'red',
  },
  flexOne: {
    flex: 2,
    // borderColor: 'blue',
    justifyContent: 'space-between',
    // borderWidth: 2,
  },
  fieldsText: {
    width: '100%',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  fieldsTextSelects: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  containerTextDownSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextDownSlider: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 12 : 14,
  },
  TextDownSliderActive: {
    color: BLUE_MAIN,
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').width <= 360 ? 12 : 14,
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
  },
  textLabel: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 13 : 15,
  },
  textLabelDate: {
    color: '#000000',
    fontSize: Dimensions.get('window').width <= 360 ? 16 : 18,
  },
  textLabelDateGray: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 16 : 18,
  },
  textValueInput: {
    color: '#000000',
    fontSize: Dimensions.get('window').width <= 360 ? 14 : 16,
  },
  flexTwo: {
    flex: 0.34,
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
    paddingVertical: 12,
    borderWidth: 2,
  },
  buttonSave: {
    borderColor: BLUE_MAIN,
    backgroundColor: BLUE_MAIN,
    width: '44%',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 12,
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
    fontSize: 13,
  },
  textSwitchInative: {
    fontSize: 13,
    color: '#BBBBBB',
  },
  containerSwitch: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'space-between',
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
