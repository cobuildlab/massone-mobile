import React, { Component } from "react";
import { SafeAreaView } from 'react-navigation';
import { 
  View,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
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
            <Button primary onPress={this._signOutAsync}>
              <Text>
              Actually, sign me out :)
              </Text>
            </Button>
          </View>
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Profile');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
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