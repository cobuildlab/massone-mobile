import React, { Component } from "react";
import { 
  View,
  Text,
  AsyncStorage,
  Image,
  TextInput
} from "react-native";
import { Content, ListItem, Body, CheckBox, Left, Right, Switch, Button, Icon } from 'native-base';
import styles from './style';
import ButtomComponet from '../componets/ButtomBlue'

class RecoverScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
  _forgot = async () => {
    this.props.navigation.navigate('Forgot');
  };
  _goBack = () => {
    this.props.navigation.goBack();
  };
  _goBackLogin = () => {
    this.props.navigation.popToTop()
  }

  render() {
    return (
        <Content contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
          <Image
            style={styles.viewBackground}
            source={require('../assets/image/bg-mobile.jpg')}
          />
          <Image
            style={styles.viewLogo}
            source={require('../assets/image/logoWhite.png')}
          />
          <Text style={styles.title}>Recover Password</Text>
          <Text style={styles.subTitleForgot}>Enter your code and new password</Text>
          <View style={{width: '80%', marginTop: 25}}>
            
            <TextInput 
            style={styles.inputLogin} 
            placeholder="Code" 
            placeholderTextColor="#fff"
            />
            <TextInput 
            style={styles.inputLogin} 
            placeholder="New Password" 
            placeholderTextColor="#fff"
            />
            <TextInput 
            style={styles.inputLogin} 
            placeholder="Confirm Password" 
            placeholderTextColor="#fff"
            />
            <ButtomComponet text="Recover" onPress={this._goBackLogin} block primary/>
            <Button block transparent onPress={this._goBack}>
              <Text style={styles.textBtn}>
                Go back
              </Text>
            </Button>
            {/* <Button block light onPress={this._signInAsync}>
              <Text>Light</Text>
            </Button>
            <Button block light onPress={this._forgot}>
              <Text>Light</Text>
            </Button> */}
          </View>
          </View>
        </Content>
    );
  }

  
}
export default RecoverScreen;