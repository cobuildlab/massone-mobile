import React, { Component } from "react";
import { SafeAreaView } from 'react-navigation';
import { 
  View,
  TouchableOpacity,
  Image
} from "react-native";
import styles from './style'
import { Button, Text, Icon, ListItem, List } from "native-base";

class SideBar extends Component {
  render() {
    const routes = this.props.navigation.state.routes
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

            if (route.key == 'Jobs') {
              icon = <Icon type="FontAwesome" name="id-badge" style={{fontSize: 20, color: '#fff', marginRight: 10}} />
            }
            if (route.key == 'Profile') {
              icon = <Icon type="FontAwesome" name="user" style={{fontSize: 20, color: '#fff'}} />
            }

            return (
              <TouchableOpacity 
              style={styles.itemMenu}
              key={route.key} 
              onPress={() => {
              this.props.navigation.navigate(route.key)
            }}>
              <Text style={styles.textItemMenu}>
              {icon} {route.routeName}
              </Text>
            </TouchableOpacity>
            )
          })}
        </View>
      </View>
    );
  }
}
export default SideBar;
