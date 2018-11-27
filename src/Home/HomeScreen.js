import React, { Component } from "react";
import { SafeAreaView } from 'react-navigation';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import { Header, Title, Button, Left, Right, Body, Icon, Text, List, SwipeRow} from 'native-base';
import * as authActions from '../Auth/actions';
import authStore from '../Auth/authStore';
import styles from './style'

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
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
  }
  _showMoreApp = () => {
    this.props.navigation.navigate('DetailsJobs');
  };

  logout = () => {
    this.setState({isLoading: true}, () => {
      authActions.logout();
    })
  };

  render() {
    return (
      <View>
        <Header style={styles.bgHeader}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.openDrawer()}>
              <Icon name='menu' style={{color: '#3d65b0'}} />
            </Button>
          </Left>
          <Body>
            <Title style={styles.titleHeader}>Jobs</Title>
          </Body>
          <Right>
          <Button transparent>
              <Icon type="FontAwesome" name='bell-o' style={{color: '#3d65b0', fontSize: 20}} />
          </Button>
          <Button transparent onPress={this.logout}>
              <Icon type="FontAwesome" name='sign-out' style={{color: '#3d65b0', fontSize: 20}} />
          </Button>
          </Right>
        </Header>
        <View>
        <List>
        <SwipeRow
            leftOpenValue={75}
            rightOpenValue={-75}
            left={
              <Button success onPress={() => alert('Add')}>
                <Icon active type="MaterialIcons" name="check" />
              </Button>
            }
            body={
              <TouchableOpacity onPress={this._showMoreApp} style={styles.listItem}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.issueName}>
                Issue Name 
              </Text>
              <Text>
                for
              </Text>
              <Text style={styles.customerName}>
                Customers Name 
              </Text>
            </View>    
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textDate}>
                Start Date: 
              </Text>
              <Text style={styles.textNumDate}>
                01/01/18
              </Text>
              <Text style={styles.textDate}>
                End Date:
              </Text>
              <Text style={styles.textNumDate}>
                02/02/18
              </Text>
            </View>       
            </TouchableOpacity>
            }
            right={
              <Button danger onPress={() => alert('Trash')}>
                <Icon active type="MaterialIcons" name="close" />
              </Button>
            }
          />
          <SwipeRow
            leftOpenValue={75}
            rightOpenValue={-75}
            left={
              <Button success onPress={() => alert('Add')}>
                <Icon active type="MaterialIcons" name="check" />
              </Button>
            }
            body={
              <TouchableOpacity onPress={this._showMoreApp} style={styles.listItem}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.issueName}>
                Issue Name 
              </Text>
              <Text>
                for
              </Text>
              <Text style={styles.customerName}>
                Customers Name 
              </Text>
            </View>    
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textDate}>
                Start Date: 
              </Text>
              <Text style={styles.textNumDate}>
                01/01/18
              </Text>
              <Text style={styles.textDate}>
                End Date:
              </Text>
              <Text style={styles.textNumDate}>
                02/02/18
              </Text>
            </View>       
            </TouchableOpacity>
            }
            right={
              <Button danger onPress={() => alert('Trash')}>
                <Icon active type="MaterialIcons" name="close" />
              </Button>
            }
          />
        </List>
      
          {/* <Text>
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
            </Button> */}
          </View>
      </View>
    );
  }
}
export default HomeScreen;