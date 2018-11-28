import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  Button,
  Icon,
  Text,
  List,
  SwipeRow,
  Content,
  Container,
} from 'native-base';
import * as authActions from '../Auth/actions';
import authStore from '../Auth/authStore';
import styles from './JobsListStyle';
import { CustomHeader } from '../utils/components';

class JobsListScreen extends Component {
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
      <Container>
        <CustomHeader leftButton={'openDrawer'} title={'Jobs'} />

        <Content>
          <List>
            <SwipeRow
              leftOpenValue={75}
              rightOpenValue={-75}
              left={
                <Button success>
                  <Icon active type="MaterialIcons" name="check" />
                </Button>
              }
              body={
                <TouchableOpacity
                  onPress={this.goToJobDetails}
                  style={styles.listItem}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.issueName}>Issue Name</Text>
                    <Text>for</Text>
                    <Text style={styles.customerName}>Customers Name</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.textDate}>Start Date:</Text>
                    <Text style={styles.textNumDate}>01/01/18</Text>
                    <Text style={styles.textDate}>End Date:</Text>
                    <Text style={styles.textNumDate}>02/02/18</Text>
                  </View>
                </TouchableOpacity>
              }
              right={
                <Button danger>
                  <Icon active type="MaterialIcons" name="close" />
                </Button>
              }
            />
            <SwipeRow
              leftOpenValue={75}
              rightOpenValue={-75}
              left={
                <Button success>
                  <Icon active type="MaterialIcons" name="check" />
                </Button>
              }
              body={
                <TouchableOpacity
                  onPress={this.goToJobDetails}
                  style={styles.listItem}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.issueName}>Issue Name</Text>
                    <Text>for</Text>
                    <Text style={styles.customerName}>Customers Name</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.textDate}>Start Date:</Text>
                    <Text style={styles.textNumDate}>01/01/18</Text>
                    <Text style={styles.textDate}>End Date:</Text>
                    <Text style={styles.textNumDate}>02/02/18</Text>
                  </View>
                </TouchableOpacity>
              }
              right={
                <Button danger>
                  <Icon active type="MaterialIcons" name="close" />
                </Button>
              }
            />
          </List>
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

export default JobsListScreen;
