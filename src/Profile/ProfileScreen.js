import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Title,
  Body,
  Card,
  CardItem,
  Text,
  Content,
  Container,
} from 'native-base';
import styles from './ProfileStyle';
import * as authActions from '../Auth/actions';
import authStore from '../Auth/authStore';
import { CustomHeader } from '../utils/components';

class ProfileScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      user: Object.assign({}, authStore.getState('Login')),
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
      <Container>
        <CustomHeader
          leftButton={'openDrawer'}
          title={'Profile'}
          rightButton={{ icon: 'ios-log-out', handler: this.logout }}
        />

        <Content>
          <View>
            <Card transparent>
              <CardItem>
                <Body>
                  <Title>Username:</Title>
                  <Text style={styles.textData}>
                    {this.state.user.username}
                  </Text>
                  <Title>Name:</Title>
                  <Text style={styles.textData}>
                    {this.state.user.first_name}
                  </Text>
                  <Title>Last Name:</Title>
                  <Text style={styles.textData}>
                    {this.state.user.last_name}
                  </Text>
                  <Title>Email:</Title>
                  <Text style={styles.textData}>{this.state.user.email}</Text>
                </Body>
              </CardItem>
            </Card>
          </View>
        </Content>
      </Container>
    );
  }

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  goToJobDetails = () => {
    this.props.navigation.navigate('JobDetails');
  };

  logout = () => {
    this.setState({ isLoading: true }, () => {
      authActions.logout();
    });
  };
}
export default ProfileScreen;
