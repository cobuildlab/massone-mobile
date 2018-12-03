import React from 'react';
import { Root, StyleProvider } from 'native-base';
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation';

import getTheme from './native-base-theme/components';

import { LoginScreen, ForgotScreen, RecoverScreen } from './src/Auth';
import { JobsListScreen, JobDetailsScreen, RejectJobScreen } from './src/Jobs';
import ProfileScreen from './src/Profile/ProfileScreen';
import AuthLoadingScreen from './src/AuthloadingScreen';
import SideBar from './src/SideBar/SideBar';

const JobsStack = createStackNavigator({
  Jobs: JobsListScreen,
  JobDetails: JobDetailsScreen,
  RejectJob: RejectJobScreen,
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Forgot: ForgotScreen,
  Recover: RecoverScreen,
});

const AppDrawerMenu = createDrawerNavigator(
  {
    Jobs: JobsStack,
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
    <StyleProvider style={getTheme()}>
      <AppNavigator />
    </StyleProvider>
  </Root>
);

export default App;
