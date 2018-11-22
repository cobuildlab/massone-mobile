import React, { Component } from "react";
import { 
  View,
  Text,
  AsyncStorage,
  Image,
  TextInput
} from "react-native";
import { Content, ListItem, Body, CheckBox, Left, Right, Switch, Button, Icon, Header, Title } from 'native-base';
import styles from './style';
import ButtomComponet from '../componets/ButtomBlue'

class ForgotScreen extends React.Component {
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
  _recover = async () => {
    this.props.navigation.navigate('Recover');
  };
  _goBack = () => {
    this.props.navigation.goBack();
  };

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
          <Text style={styles.title}>Forgor Password?</Text>
          <Text style={styles.subTitleForgot}>Enter your Email and we will send you a password link</Text>
          <View style={{width: '80%', marginTop: 25}}>
            
            <TextInput 
            style={styles.inputLogin} 
            placeholder="Email" 
            placeholderTextColor="#fff"
            />
            <ButtomComponet text="Send Request" onPress={this._recover} block primary/>
            <Button block transparent onPress={this._goBack}>
              <Text style={styles.textBtn}>
                Go back Login
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
export default ForgotScreen;