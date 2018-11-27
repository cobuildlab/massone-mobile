import React from 'react';
import { Root } from 'native-base';
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';

import {
  LoginScreen,
  ForgotScreen,
  RecoverScreen,
} from './src/Auth';
import HomeScreen from './src/Home/HomeScreen';
import ProfileScreen from './src/Profile/ProfileScreen';
import AuthLoadingScreen from './src/AuthloadingScreen';
import SideBar from './src/SideBar/SideBar';

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Forgot: ForgotScreen,
  Recover: RecoverScreen,
});

const AppDrawerMenu = createDrawerNavigator(
  {
    Jobs: HomeScreen,
    Profile: ProfileScreen,
  },
  {
    contentComponent: (props) => <SideBar {...props} />,
  },
);

const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppDrawerMenu,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

const App = () => (
  <Root>
    <AppNavigator />
  </Root>
);

export default App;
