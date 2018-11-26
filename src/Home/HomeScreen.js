import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Content } from 'native-base';
import * as authActions from '../Auth/actions';
import authStore from '../Auth/authStore';
import { Loading } from '../utils/components';

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    this.logoutSubscription = authStore.subscribe('Logout', this.logoutHandler);
  }

  componentWillUnmount() {
    this.logoutSubscription.unsubscribe();
  }

  logoutHandler = () => {
    this.setState({ isLoading: false });
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <Content
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {this.state.isLoading ? <Loading /> : null}

        <View style={styles.container}>
          <Button title="Show me more of the app" onPress={this.showMoreApp} />
          <Button title="Actually, sign me out :)" onPress={this.logout} />
        </View>
      </Content>
    );
  }

  showMoreApp = () => {
    this.props.navigation.navigate('Profile');
  };

  logout = () => {
    this.setState({ isLoading: true }, () => {
      authActions.logout();
    });
  };
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
});
