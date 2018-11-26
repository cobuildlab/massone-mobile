import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Content, Button, Input } from 'native-base';
import styles from './style';
import ButtomComponet from '../componets/ButtomBlue';
import * as authActions from './actions';
import authStore from './authStore';
import { CustomToast, Loading } from '../utils/components';
import { BG_MOBILE_IMG, LOGO_WHITE } from '../assets/image/';

class ForgotScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
    };
  }

  componentDidMount() {
    this.forgotPasswordSubscription = authStore.subscribe(
      'ForgotPassword',
      this.forgotPasswordHandler,
    );
    this.authStoreError = authStore.subscribe(
      'AuthStoreError',
      this.errorHandler,
    );
  }

  componentWillUnmount() {
    this.forgotPasswordSubscription.unsubscribe();
    this.authStoreError.unsubscribe();
  }

  forgotPasswordHandler = () => {
    this.setState({ isLoading: false });
    CustomToast('You will receive an email with a code to reset your password');
    this.props.navigation.navigate('Recover');
  };

  errorHandler = (err) => {
    this.setState({ isLoading: false });
    CustomToast(err, 'danger');
  };

  render() {
    return (
      <Content contentContainerStyle={{ flexGrow: 1 }}>
        {this.state.isLoading ? <Loading /> : null}

        <View style={styles.container}>
          <Image style={styles.viewBackground} source={BG_MOBILE_IMG} />
          <Image style={styles.viewLogo} source={LOGO_WHITE} />
          <Text style={styles.title}>Forgor Password?</Text>
          <Text style={styles.subTitleForgot}>
            Enter your Email and we will send you a password link
          </Text>
          <View style={{ width: '80%', marginTop: 25 }}>
            <Input
              style={styles.inputLogin}
              keyboardType={'email-address'}
              autoCapitalize={'none'}
              value={this.state.email}
              placeholder="Email"
              placeholderTextColor="#fff"
              onChangeText={(text) => this.setState({ email: text })}
            />
            <ButtomComponet
              text="Send Request"
              onPress={this.forgotPassword}
              block
              primary
            />
            <Button block transparent onPress={this.goToResetPassword}>
              <Text style={styles.textBtn}>
                Already have a code? Click here
              </Text>
            </Button>
            <Button block transparent onPress={this.goBack}>
              <Text style={styles.textBtn}>Go back Login</Text>
            </Button>
          </View>
        </View>
      </Content>
    );
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  goToResetPassword = () => {
    this.props.navigation.navigate('Recover');
  };

  forgotPassword = () => {
    this.setState({ isLoading: true }, () => {
      authActions.forgotPassword(this.state.email);
    });
  };
}
export default ForgotScreen;
