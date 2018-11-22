import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";

class ForgotScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>ForgotScreen</Text>
      </View>
    );
  }
}
export default ForgotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});