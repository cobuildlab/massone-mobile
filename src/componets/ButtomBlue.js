import React from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";
import { Button } from 'native-base';

const ButtonBlue = (props) => (
  <View>
    <Button style={styles.StyleButtom} {...props}>
      <Text style={styles.textBtn}>
        {props.text}
      </Text>
    </Button>
  </View>
);

export default ButtonBlue;

const styles = StyleSheet.create({
  StyleButtom:{
    marginTop: 10, 
    backgroundColor: '#537DBf',
    height: 35,
    padding: 0,
    borderRadius: 5
  },
  textBtn:{
    color: '#fff', 
    fontWeight: 'bold',
    marginTop: 0
  }
});