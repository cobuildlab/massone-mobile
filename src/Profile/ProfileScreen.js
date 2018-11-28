import React, { Component } from 'react';
// import { SafeAreaView } from 'react-navigation';
import { View } from 'react-native';
import {
  Header,
  Title,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Card,
  CardItem,
  Text,
} from 'native-base';
import styles from './ProfileStyle';
import * as authActions from '../Auth/actions';
import authStore from '../Auth/authStore';
import { BLUE_MAIN } from '../constants/colorPalette';

class ProfileScreen extends Component {
  static navigationOptions = {
    header: null,
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
      <View>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}>
              <Icon name="menu" style={{ color: BLUE_MAIN }} />
            </Button>
          </Left>
          <Body>
            <Title style={styles.titleHeader}>Profile</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.logout}>
              <Icon
                type="FontAwesome"
                name="sign-out"
                style={{ color: BLUE_MAIN, fontSize: 20 }}
              />
            </Button>
          </Right>
        </Header>
        <View>
          <Card transparent>
            <CardItem>
              <Body>
                <Title>Name:</Title>
                <Text style={styles.textData}>Jose</Text>
                <Title>Last Name:</Title>
                <Text style={styles.textData}>Villalobos</Text>
                <Title>Email:</Title>
                <Text style={styles.textData}>jvillalobos@4geeks.co</Text>
              </Body>
            </CardItem>
          </Card>
        </View>
      </View>
    );
  }
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
