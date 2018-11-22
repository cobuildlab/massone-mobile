import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";

class SideBar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>SideBar</Text>
      </View>
    );
  }
}
export default SideBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});