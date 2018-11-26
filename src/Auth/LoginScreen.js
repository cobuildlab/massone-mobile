import React, { Component } from "react";
import {
  View,
  Text,
  AsyncStorage,
  Image,
  TouchableOpacity,
} from "react-native";
import { Content, ListItem, Body, CheckBox, Left, Right, Switch, Button, Icon,
Input } from 'native-base';
import styles from './style';
import ButtomComponet from '../componets/ButtomBlue';
import * as authActions from './actions';
import authStore from './authStore';
import { CustomToast, Loading } from '../utils/components';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
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
    this.authStoreError = authStore.subscribe('AuthStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.loginSubscription.unsubscribe();
    this.authStoreError.unsubscribe();
  }

  loginHandler = (user) => {
    this.setState({isLoading: false});
    let token;

    try {
      token = user.token;
    } catch (e) {
      return LOG(this, e);
    }

    if (token) {
      return this.props.navigation.navigate('App');
    }
  }

  errorHandler = (err) => {
    this.setState({isLoading: false});
    CustomToast(err, 'danger');
  }

  _forgot = async () => {
    this.props.navigation.navigate('Forgot');
  };

  render() {
    return (
        <Content contentContainerStyle={{ flexGrow: 1 }}>
          {this.state.isLoading ? <Loading/> : null}

          <View style={styles.container}>
          <Image
            style={styles.viewBackground}
            source={require('../assets/image/bg-mobile.jpg')}
          />
          <Image
            style={styles.viewLogo}
            source={require('../assets/image/logoWhite.png')}
          />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subTitle}>Please login to your account</Text>
            <View style={{width: '80%'}}>

              <Input
              style={styles.inputLogin}
              autoCapitalize={'none'}
              value={this.state.username}
              placeholder="Username"
              placeholderTextColor="#fff"
              onChangeText={(text) => this.setState({username: text})}
              />
              <Input
              style={styles.inputLogin}
              value={this.state.password}
              placeholderTextColor="#fff"
              placeholder="Password"
              onChangeText={(text) => this.setState({password: text})}
              secureTextEntry={true}
              />
              <ListItem icon>
                <Left style={{marginLeft: -18}}>
                  <CheckBox
                    onPress={this.rememberMe} 
                    checked={this.state.rememberMe} 
                    color={this.state.rememberMe ? '#537DBf' : 'white'} />
                </Left>
                <Body style={{borderBottomWidth: 0}}>
                  <TouchableOpacity onPress={this.rememberMe}>
                    <Text style={styles.textBtn}>Remember me</Text>
                  </TouchableOpacity>
                </Body>
                <Right style={{borderBottomWidth: 0}}>
                <Button transparent light onPress={this._forgot}>
                  <Text style={styles.textBtn}>Forgot Password</Text>
                </Button>
                </Right>
              </ListItem>
              <ButtomComponet text="Login" onPress={this.login} block primary/>
            </View>
            <View>
              <Button block transparent onPress={this._goBack}>
                <Text style={styles.textBtn}>
                  Terms of use. Privacy Policy
                </Text>
              </Button>
            </View>
          </View>
        </Content>
    );
  }

  rememberMe = () => {
    this.setState({ rememberMe: !this.state.rememberMe });
  }

  login = () => {
    this.setState({ isLoading: true }, () => {
      authActions.login(this.state.username, this.state.password);
    });
  }
}
export default LoginScreen;
