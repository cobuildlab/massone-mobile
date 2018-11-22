import React from 'react'

import { DrawerNavigator } from 'react-navigation'

import Profile from '../Profile/index'
import SideBar from '../SideBar/SideBar'

import HomeScreen from './HomeScreen'

export default DrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Profile: { screen: Profile },
  },
  {
    contentComponent: props => <SideBar {...props} />,
  }
)