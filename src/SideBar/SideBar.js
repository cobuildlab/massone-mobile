import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import styles from './style';
import * as authActions from '../Auth/actions';
import { LOG } from '../utils';
import { Text, Icon } from 'native-base';
import { BG_MOBILE_IMG, LOGO_WHITE } from '../assets/image/';
import { withNamespaces } from 'react-i18next';
import { validateRoles } from '../utils';
import authStore from '../Auth/authStore';
import LinearGradient from 'react-native-linear-gradient';

class SideBar extends Component {
  state = {
    isLoading: false,
  };

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

  logout = () => {
    Alert.alert(this.props.t('AUTH.wantToLogout'), '', [
      {
        text: this.props.t('APP.cancel'),
        onPress: () => {
          LOG(this, 'Cancel logout');
        },
      },
      {
        text: this.props.t('AUTH.logout'),
        onPress: () => {
          this.setState({ isLoading: true }, () => {
            authActions.logout();
          });
        },
      },
    ]);
  };

  render() {
    const routes = this.props.navigation.state.routes;
    const { isLoading } = this.state;
    return (
      <LinearGradient colors={['#537DBF', '#537DBF', '#06306E']} style={styles.container}>
        <View>
          <Image style={styles.viewBackground} source={BG_MOBILE_IMG} />
          <View style={styles.logoSideBar}>
            <Image style={styles.viewLogo} source={LOGO_WHITE} />
          </View>
        </View>
        <View>
          {routes
            .filter((rou) =>
              rou.key === 'Admin' && validateRoles(['Admin']) ? rou : rou.key !== 'Admin',
            )
            .map((route) => {
              let icon;
              if (route.key == 'Jobs') {
                icon = <Icon name="wrench" type="MaterialCommunityIcons" style={styles.iconMenu} />;
              }
              if (route.key == 'Profile') {
                icon = <Icon name="user-circle" type="FontAwesome" style={styles.iconMenu} />;
              }
              if (route.key == 'Admin') {
                icon = <Icon name="pencil" type="MaterialCommunityIcons" style={styles.iconMenu} />;
              }

              return (
                <TouchableOpacity
                  disabled={isLoading}
                  style={styles.itemMenu}
                  key={route.key}
                  onPress={() => {
                    this.props.navigation.navigate(route.key);
                    this.props.navigation.closeDrawer();
                  }}>
                  {icon}
                  <Text style={styles.textItemMenu}>{route.routeName}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
        {isLoading ? (
          <View style={styles.containerLoading}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          <View style={styles.containerLogout}>
            <TouchableOpacity onPress={() => this.logout()} style={styles.buttonLogout}>
              <Icon name="logout-variant" style={styles.iconLogout} type="MaterialCommunityIcons" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    );
  }
}

export default withNamespaces()(SideBar);
