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
import {
  JobsListScreen,
  JobDetailsScreen,
  JobHistoryScreen,
  PauseJobScreen,
  CommentsScreen,
  CloseJobScreen,
  PdfScreen,
  ImageScreen,
  SignatureScreen,
  SearchPartsScreen,
} from './src/Jobs';
import ProfileScreen from './src/Profile/ProfileScreen';
import AuthLoadingScreen from './src/AuthloadingScreen';
import JobAdminListScreen from './src/modules/admin/JobAdminListScreen';
import SideBar from './src/SideBar/SideBar';

const JobsStack = createStackNavigator({
  Jobs: JobsListScreen,
  JobDetails: JobDetailsScreen,
  JobHistory: JobHistoryScreen,
  PauseJob: PauseJobScreen,
  Comments: CommentsScreen,
  CloseJob: CloseJobScreen,
  Pdf: PdfScreen,
  Image: ImageScreen,
  Signature: SignatureScreen,
  SearchParts: SearchPartsScreen,
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
    // Admin: JobAdminListScreen,
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
