import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Content, Button, Input } from 'native-base';
import styles from './style';
import ButtomComponet from '../shared/componets/ButtomBlue';
import * as authActions from './actions';
import authStore from './authStore';
import { CustomToast, Loading } from '../utils/components';
import { BG_MOBILE_IMG, LOGO_WHITE } from '../assets/image/';
import { withNamespaces } from 'react-i18next';

class RecoverScreen extends Component {
  static navigationOptions = {
    header: null,
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
    this.resetPasswordSubscription = authStore.subscribe(
      'ResetPassword',
      this.resetPasswordHandler,
    );
    this.authStoreError = authStore.subscribe('AuthStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.resetPasswordSubscription.unsubscribe();
    this.authStoreError.unsubscribe();
  }

  resetPasswordHandler = () => {
    this.setState({ isLoading: false });
    CustomToast(this.props.t('AUTH.passwordChanged'));
    this.props.navigation.navigate('Login');
  };

  errorHandler = (err) => {
    this.setState({ isLoading: false });
    CustomToast(err, 'danger');
  };

  render() {
    const { t } = this.props;

    return (
      <Content contentContainerStyle={{ flexGrow: 1 }}>
        {this.state.isLoading ? <Loading /> : null}

        <View style={styles.container}>
          <Image style={styles.viewBackground} source={BG_MOBILE_IMG} />
          <Image style={styles.viewLogo} source={LOGO_WHITE} />
          <Text style={styles.title}>{t('AUTH.recoverPassword')}</Text>
          <Text style={styles.subTitleForgot}>{t('AUTH.enterYourCode')}</Text>
          <View style={{ width: '80%', marginTop: 25 }}>
            <Input
              style={styles.inputLogin}
              autoCapitalize={'none'}
              value={this.state.code}
              placeholder={t('AUTH.code')}
              placeholderTextColor="#fff"
              onChangeText={(text) => this.setState({ code: text })}
            />
            <Input
              style={styles.inputLogin}
              placeholder={t('AUTH.newPassword')}
              placeholderTextColor="#fff"
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry={true}
            />
            <Input
              style={styles.inputLogin}
              placeholder={t('AUTH.confirmPassword')}
              placeholderTextColor="#fff"
              value={this.state.repeatPassword}
              onChangeText={(text) => this.setState({ repeatPassword: text })}
              secureTextEntry={true}
            />
            <ButtomComponet text={t('AUTH.recover')} onPress={this.resetPassword} block primary />
            <Button title={'BACK'} block transparent onPress={this.goBack}>
              <Text style={styles.textBtn}>{t('APP.goBack')}</Text>
            </Button>
          </View>
        </View>
      </Content>
    );
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  resetPassword = () => {
    this.setState({ isLoading: true }, () => {
      authActions.resetPassword(this.state.code, this.state.password, this.state.repeatPassword);
    });
  };
}

export default withNamespaces()(RecoverScreen);
