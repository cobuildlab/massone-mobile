import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {
  Content,
  ListItem,
  Body,
  CheckBox,
  Left,
  Right,
  Button,
  Input,
} from 'native-base';
import styles from './style';
import ButtomComponet from '../componets/ButtomBlue';
import * as authActions from './actions';
import authStore from './authStore';
import { LOG } from '../utils';
import { CustomToast, Loading } from '../utils/components';
import { BG_MOBILE_IMG, LOGO_WHITE } from '../assets/image/';
import { withNamespaces } from 'react-i18next';
import { BLUE_MAIN } from '../constants/colorPalette';

class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      rememberMe: false,
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    this.loginSubscription = authStore.subscribe('Login', this.loginHandler);
    this.authStoreError = authStore.subscribe(
      'AuthStoreError',
      this.errorHandler,
    );
  }

  componentWillUnmount() {
    this.loginSubscription.unsubscribe();
    this.authStoreError.unsubscribe();
  }

  loginHandler = (user) => {
    this.setState({ isLoading: false });
    let token;

    try {
      token = user.token;
    } catch (e) {
      return LOG(this, e);
    }

    if (token) {
      return this.props.navigation.navigate('App');
    }
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
          <Text style={styles.title}>{t('AUTH.wellcomeBack')}</Text>
          <Text style={styles.subTitle}>{t('AUTH.pleaseLogin')}</Text>
          <View style={{ width: '80%' }}>
            <Input
              style={styles.inputLogin}
              autoCapitalize={'none'}
              value={this.state.username}
              placeholder="Username"
              placeholderTextColor="#fff"
              onChangeText={(text) => this.setState({ username: text })}
            />
            <Input
              style={styles.inputLogin}
              value={this.state.password}
              placeholderTextColor="#fff"
              placeholder="Password"
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry={true}
            />
            <ListItem icon>
              <Left style={{ marginLeft: -18 }}>
                <CheckBox
                  onPress={this.rememberMe}
                  checked={this.state.rememberMe}
                  color={this.state.rememberMe ? BLUE_MAIN : 'white'}
                />
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
                <TouchableOpacity onPress={this.rememberMe}>
                  <Text style={styles.textBtn}>{t('AUTH.rememberMe')}</Text>
                </TouchableOpacity>
              </Body>
              <Right style={{ borderBottomWidth: 0 }}>
                <Button transparent light onPress={this.forgot}>
                  <Text style={styles.textBtn}>{t('AUTH.forgotPassword')}</Text>
                </Button>
              </Right>
            </ListItem>
            <ButtomComponet
              text={t('AUTH.login')}
              onPress={this.login}
              block
              primary
            />
          </View>
          <View>
            <Button block transparent onPress={this.goBack}>
              <Text style={styles.textBtn}>{t('AUTH.termsAndPrivacy')}</Text>
            </Button>
          </View>
        </View>
      </Content>
    );
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  forgot = async () => {
    this.props.navigation.navigate('Forgot');
  };

  rememberMe = () => {
    this.setState({ rememberMe: !this.state.rememberMe });
  };

  login = () => {
    this.setState({ isLoading: true }, () => {
      authActions.login(this.state.username, this.state.password);
    });
  };
}

export default withNamespaces()(LoginScreen);
