import { StyleSheet } from 'react-native';
import { BLUE_MAIN, GRAY_MAIN } from '../constants/colorPalette';

export default StyleSheet.create({
  flatList: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  item: {
    marginLeft: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  viewEmptyComment: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxComment: {
    marginHorizontal: 15,
    borderColor: '#537DBF',
    borderRadius: 18,
    borderWidth: 1.5,
  },
  nameEmployee: {
    color: '#537DBF',
    fontWeight: 'bold',
  },
  iconBlue: {
    color: BLUE_MAIN,
    fontSize: 32,
  },
  thumbnail: {
    marginLeft: 5,
    marginBottom: 5,
  },
  imageView: {
    width: 60,
  },
  fileView: {
    marginHorizontal: 5,
    marginVertical: 10,
  },
  fileButton: {
    justifyContent: 'space-evenly',
  },
  fileText: {
    marginHorizontal: 20,
  },
  iconClose: {
    color: GRAY_MAIN,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  rolesText: {
    color: BLUE_MAIN,
  },
});
