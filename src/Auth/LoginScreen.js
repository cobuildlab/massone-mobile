import React, { Component } from "react";
import { 
  View,
  Text,
  AsyncStorage,
  Image,
  TextInput
} from "react-native";
import { Content, ListItem, Body, CheckBox, Left, Right, Switch, Button, Icon } from 'native-base';
import styles from './style';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
  _forgot = async () => {
    this.props.navigation.navigate('Forgot');
  };

  render() {
    return (
        <Content contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
          <Image
            style={styles.viewBackground}
            source={require('../assets/image/bg-mobile.jpg')}
          />
          <Image
            style={styles.viewLogo}
            source={require('../assets/image/logoWhite.png')}
          />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subTitle}>Please login to your account</Text>
          <View style={{width: '80%'}}>
            
            <TextInput 
            style={styles.inputLogin} 
            placeholder="Username" 
            placeholderTextColor="#fff"
            />
            <TextInput 
            style={styles.inputLogin} 
            placeholderTextColor="#fff"
            placeholder="Password" 
            />
            <ListItem icon>
              <Left style={{marginLeft: -18}}>
                <CheckBox checked={false} color="white" />
              </Left>
              <Body style={{borderBottomWidth: 0}}>
                <Text style={styles.textBtn}>Remenber me</Text>
              </Body>
              <Right style={{borderBottomWidth: 0}}>
              <Button transparent light onPress={this._forgot}>
                <Text style={styles.textBtn}>Forgot Password</Text>
              </Button>
              </Right>
            </ListItem>
            <Button block primary style={{marginTop: '5%', backgroundColor: '#537DBf'}}>
              <Text style={styles.textBtn}>
                Login
              </Text>
            </Button>
            {/* <Button block light onPress={this._signInAsync}>
              <Text>Light</Text>
            </Button>
            <Button block light onPress={this._forgot}>
              <Text>Light</Text>
            </Button> */}
          </View>
          </View>
        </Content>
    );
  }

  
}
export default LoginScreen;
