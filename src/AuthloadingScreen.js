import React from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { LOG } from './utils';
import authStore from './Auth/authStore';
import * as authActions from './Auth/actions';
import LOGO_IMG from './assets/image/logoBlue.png';

const widthSize = Dimensions.get('window').width;
const factor = 604 / widthSize;
const heightSize = 370 / factor;
class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loginSubscription = authStore.subscribe('Login', this.loginHandler);

    setTimeout(() => {
      this.bootstrapAsync();
    }, 1300);
  }

  componentWillUnmount() {
    this.loginSubscription.unsubscribe();
  }

  loginHandler = (user) => {
    let token;

    try {
      token = user.token;
    } catch (e) {
      return LOG(this, e);
    }

    if (token) {
      return this.props.navigation.navigate('App');
    }

    this.props.navigation.navigate('Auth');
  };

  // Fetch the token from AsycnStorage/FluxState then navigate to our appropriate place
  bootstrapAsync = async () => {
    let userData = authStore.getState('Login');

    if (!userData || !userData.token) {
      const userString = await AsyncStorage.getItem('user');

      try {
        userData = JSON.parse(userString);
      } catch (e) {
        LOG(this, e);
      }
    }

    authActions.setStoredUser(userData || {});
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <Image source={LOGO_IMG} style={styles.imgSplash} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  // adapting splash screen
  imgSplash: {
    width: widthSize - 160,
    height: heightSize - 95,
  },
});

export default AuthLoadingScreen;
