import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import styles from './style';
import { Text, Icon } from 'native-base';
import { BG_MOBILE_IMG, LOGO_WHITE } from '../assets/image/';

class SideBar extends Component {
  render() {
    const routes = this.props.navigation.state.routes;
    return (
      <View style={styles.container}>
        <View>
          <Image style={styles.viewBackground} source={BG_MOBILE_IMG} />
          <View style={styles.logoSideBar}>
            <Image style={styles.viewLogo} source={LOGO_WHITE} />
          </View>
        </View>
        <View>
          {routes.map((route) => {
            let icon;

            if (route.key == 'Jobs') {
              icon = (
                <Icon
                  type="FontAwesome"
                  name="id-badge"
                  style={{ fontSize: 20, color: '#fff', marginRight: 10 }}
                />
              );
            }
            if (route.key == 'Profile') {
              icon = (
                <Icon
                  type="FontAwesome"
                  name="user"
                  style={{ fontSize: 20, color: '#fff' }}
                />
              );
            }

            return (
              <TouchableOpacity
                style={styles.itemMenu}
                key={route.key}
                onPress={() => {
                  this.props.navigation.navigate(route.key);
                  this.props.navigation.closeDrawer();
                }}>
                <Text style={styles.textItemMenu}>
                  {icon} {route.routeName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

export default SideBar;
