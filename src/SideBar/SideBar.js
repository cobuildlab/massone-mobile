import React, { Component } from "react";
import { SafeAreaView } from 'react-navigation';
import { 
  View,

  StyleSheet,
  Image
} from "react-native";
import styles from './style'
import { Button, Text, Icon } from "native-base";

class SideBar extends Component {
  render() {
    const routes = this.props.navigation.state.routes
    console.warn(routes)
    return (
      <View style={styles.container}>
        <View>
          <Image
            style={styles.viewBackground}
            source={require('../assets/image/bg-mobile.jpg')}
          />
          <View style={styles.logoSideBar}>
            <Image
              style={styles.viewLogo}
              source={require('../assets/image/logoWhite.png')}
            />
          </View>
        </View>
        <View>
          {routes.map(route => {
            let icon

            if (route.key == 'Home') {
              icon = <Icon name="home" />
            }
            if (route.key == 'Profile') {
              icon = <Icon name="user" />
            }

            return (
              <Button key={route.key} onPress={() => {
              this.props.navigation.navigate(route.key)
            }}>
              {icon}
              <Text>
                {route.routeName}
              </Text>
            </Button>
            )
          })}
        </View>
      </View>
    );
  }
}
export default SideBar;
