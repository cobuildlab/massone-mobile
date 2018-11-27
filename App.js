import React from 'react';
import { Root } from "native-base";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';

import LoginScreen from './src/Auth/LoginScreen';
import ForgotScreen from './src/Auth/ForgotScreen';
import RecoverScreen from './src/Auth/RecoverScreen';
import HomeScreen from './src/Home/HomeScreen';
import DetailsScreen from './src/DetailsJobs/DetailsScreen';
import ProfileScreen from './src/Profile/ProfileScreen';
import AuthLoadingScreen from './src/AuthloadingScreen';
import SideBar from './src/SideBar/SideBar';

const JobsStack = createStackNavigator({
  Home: HomeScreen,
  DetailsJobs: DetailsScreen,
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Forgot: ForgotScreen,
  Recover: RecoverScreen
});

const AppDrawerMenu = createDrawerNavigator({
  Jobs: JobsStack,
  Profile: ProfileScreen
  }, {
    contentComponent: props => < SideBar { ...props}/>,
});

const App = createAppContainer(createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: AppDrawerMenu,
  Auth: AuthStack,
}, {
  initialRouteName: 'AuthLoading',
}));

export default () => <Root>
    <App/>
</Root>
