import React, { Component } from "react";
import { SafeAreaView } from 'react-navigation';
import {
  View,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import * as authActions from '../Auth/actions';
import authStore from '../Auth/authStore';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  componentDidMount() {
    this.logoutSubscription = authStore.subscribe('Logout', this.logoutHandler);
  }

  componentWillUnmount() {
    this.logoutSubscription.unsubscribe();
  }

  logoutHandler = () => {
    this.setState({ isLoading: false });
    this.props.navigation.navigate('Auth');
  }
  _showMoreApp = () => {
    this.props.navigation.navigate('Profile');
  };

  logout = () => {
    this.setState({isLoading: true}, () => {
      authActions.logout();
    })
  };

  render() {
    return (
      <View>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.openDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>
        <View>
          <Text>
            This is Content Section
          </Text>
          <Button primary onPress={this._showMoreApp}>
            <Text>
              Show me more of the app
            </Text>
            </Button>
            <Button primary onPress={this.logout}>
              <Text>
              Actually, sign me out :)
              </Text>
            </Button>
          </View>
      </View>
    );
  }
}
export default HomeScreen;