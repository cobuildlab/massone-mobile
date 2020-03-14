import { StyleSheet, Dimensions } from 'react-native';
import { BLUE_MAIN, VIOLET, GRAY_DARK } from '../constants/colorPalette';

export default StyleSheet.create({
  list: {
    marginTop: 1,
  },
  titleHeader: {
    fontSize: 18,
  },
  containerFlatList: {
    flex: 1,
    marginHorizontal: 12,
  },
  emptyJobsView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTitle: {
    justifyContent: 'space-between',
    paddingBottom: 7,
  },
  containerAddress: {
    flexDirection: 'row',
    paddingBottom: 5,
  },
  iconEmployeAndLocation: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 18 : 20,
  },
  textStyle: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 360 ? 14 : 16,
  },
  listItem: {
    // paddingLeft: 15,
    // paddingRight: 15,
    paddingVertical: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  containerEmployee: {
    flexDirection: 'row',
    paddingBottom: 7,
  },
  containerIconFooter: {
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    // borderColor: 'red',
    // borderWidth: 0.5,
  },
  iconsFooter: {
    color: '#BBBBBB',
    fontSize: Dimensions.get('window').width <= 350 ? 17 : 19,
  },
  emptyJobs: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyJobsText: {
    color: BLUE_MAIN,
    fontWeight: '600',
    fontSize: Dimensions.get('window').width <= 350 ? 17 : 19,
  },
  textLeft: {
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  textTitleJob: {},
  textDateJob: {
    color: '#BBBBBB',
    textAlign: 'right',
    fontSize: Dimensions.get('window').width <= 350 ? 10 : 12,
  },
  issueName: {
    fontWeight: '700',
    color: BLUE_MAIN,
  },
  fieldworkerName: {
    fontWeight: '700',
    color: VIOLET,
  },
  textGray: {
    color: GRAY_DARK,
    fontWeight: '700',
  },
});
