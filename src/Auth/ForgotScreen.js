import React, { Component } from "react";
import {
  View,
  Text,
  AsyncStorage,
  Image,
} from "react-native";
import { Content, ListItem, Body, CheckBox, Left, Right, Switch, Button, Icon, Header, Title,
Input } from 'native-base';
import styles from './style';
import ButtomComponet from '../componets/ButtomBlue';
import * as authActions from './actions';
import authStore from './authStore';
import { CustomToast } from '../utils/components';

class ForgotScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
    };
  }

  componentDidMount() {
    this.forgotPasswordSubscription = authStore.subscribe('ForgotPassword', this.forgotPasswordHandler);
    this.authStoreError = authStore.subscribe('AuthStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.forgotPasswordSubscription.unsubscribe();
    this.authStoreError.unsubscribe();
  }

  forgotPasswordHandler = () => {
    this.setState({isLoading: false});
    CustomToast('You will receive an email with a code to reset your password');
    this.props.navigation.navigate('Recover');
  }

  errorHandler = (err) => {
    this.setState({isLoading: false});
    CustomToast(err, 'danger');
  }

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

            <Input
            style={styles.inputLogin}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            value={this.state.email}
            placeholder="Email"
            placeholderTextColor="#fff"
            onChangeText={(text) => this.setState({email: text})}
            />
            <ButtomComponet text="Send Request" onPress={this.forgotPassword} block primary/>
            <Button block transparent onPress={this.goToResetPassword}>
              <Text style={styles.textBtn}>
                Already have a code? Click here
              </Text>
            </Button>
            <Button block transparent onPress={this._goBack}>
              <Text style={styles.textBtn}>
                Go back Login
              </Text>
            </Button>
          </View>
          </View>
        </Content>
    );
  }

  goToResetPassword = () => {
    this.props.navigation.navigate('Recover');
  }

  forgotPassword = () => {
    this.setState({isLoading: true}, () => {
      authActions.forgotPassword(this.state.email);
    });
  }
}
export default ForgotScreen;
