import React, { Component } from "react";
import { SafeAreaView } from 'react-navigation';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import { Header, Title, Button, Left, Right, Body, Icon, Text, List, ListItem, Card, CardItem } from 'native-base';
import * as authActions from '../Auth/actions';
import authStore from '../Auth/authStore';
import styles from './style'

class DetailsScreen extends Component {
  static navigationOptions = {
    title: 'Details Jobs',
    headerStyle: {
      backgroundColor: '#e4e4e4',
    },
    headerRight: (
      <Text>...</Text>
    ),
  };

  render() {
    return (
      <View>
        <Card transparent>
          <CardItem>
            <Body>
              <Text>
                Information details Jobs
              </Text>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  }
}
export default DetailsScreen;