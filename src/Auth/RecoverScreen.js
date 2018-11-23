import React, { Component } from "react";
import {
  View,
  Text,
  AsyncStorage,
  Image,
} from "react-native";
import { Content, ListItem, Body, CheckBox, Left, Right, Switch, Button, Icon,
Input } from 'native-base';
import styles from './style';
import ButtomComponet from '../componets/ButtomBlue';
import * as authActions from './actions';
import authStore from './authStore';
import { CustomToast } from '../utils/components';

class RecoverScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      code: '',
      password: '',
      repeatPassword: '',
    };
  }

  componentDidMount() {
    this.resetPasswordSubscription = authStore.subscribe('ResetPassword', this.resetPasswordHandler);
    this.authStoreError = authStore.subscribe('AuthStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.resetPasswordSubscription.unsubscribe();
    this.authStoreError.unsubscribe();
  }

  resetPasswordHandler = () => {
    this.setState({isLoading: false});
    CustomToast('Password changed!');
    this.props.navigation.navigate('Login');
  }

  errorHandler = (err) => {
    this.setState({isLoading: false});
    CustomToast(err, 'danger');
  }

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

            <Input
            style={styles.inputLogin}
            autoCapitalize={'none'}
            value={this.state.code}
            placeholder="Code"
            placeholderTextColor="#fff"
            value={this.state.code}
            onChangeText={(text) => this.setState({code: text})}
            />
            <Input
            style={styles.inputLogin}
            placeholder="New Password"
            placeholderTextColor="#fff"
            value={this.state.password}
            onChangeText={(text) => this.setState({password: text})}
            secureTextEntry={true}
            />
            <Input
            style={styles.inputLogin}
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            value={this.state.repeatPassword}
            onChangeText={(text) => this.setState({repeatPassword: text})}
            secureTextEntry={true}
            />
            <ButtomComponet text="Recover" onPress={this.resetPassword} block primary/>
            <Button block transparent onPress={this._goBack}>
              <Text style={styles.textBtn}>
                Go back
              </Text>
            </Button>
          </View>
          </View>
        </Content>
    );
  }

  resetPassword = () => {
    this.setState({isLoading: true}, () => {
      authActions.resetPassword(
        this.state.code,
        this.state.password,
        this.state.repeatPassword,
      );
    });
  }
}
export default RecoverScreen;
