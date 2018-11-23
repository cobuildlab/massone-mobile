import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  AsyncStorage,
} from "react-native";
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

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this.logout} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Profile');
  };

  logout = () => {
    this.setState({isLoading: true}, () => {
      authActions.logout();
    })
  };
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
