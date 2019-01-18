import React from 'react';
import { AsyncStorage, StyleSheet, Image, View } from 'react-native';
import { LOG } from './utils';
import authStore from './Auth/authStore';
import * as authActions from './Auth/actions';
import LOGO_IMG from './assets/image/logoBlue.png';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loginSubscription = authStore.subscribe('Login', this.loginHandler);

    setTimeout(() => {
      this.bootstrapAsync();
    }, 1000);
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
  imgSplash: {
    width: 201,
    height: 123,
    resizeMode: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthLoadingScreen;
