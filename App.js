import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.
import LoginScreen from './src/Auth/LoginScreen';
import ForgotScreen from './src/Auth/ForgotScreen';
import HomeScreen from './src/Home/HomeScreen';
import ProfileScreen from './src/Profile/ProfileScreen';
import AuthLoadingScreen from './src/AuthloadingScreen'

const AppStack = createStackNavigator({ Home: HomeScreen, Profile: ProfileScreen });
const AuthStack = createStackNavigator({ Login: LoginScreen, Forgot: ForgotScreen });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
// import React, { Component } from 'react'

// import HomeScreen from './src/Home/HomeScreen'

// export default class AuthLoadingScreen extends Component {

//   render() {
//     return <HomeScreen />
//   }
// }