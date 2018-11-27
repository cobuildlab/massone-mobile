import React, { Component } from 'react';
// import { SafeAreaView } from 'react-navigation';
import { View } from 'react-native';
import { Body, Text, Card, CardItem } from 'native-base';
// import styles from './style'

class JobDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Details Jobs',
    headerStyle: {
      backgroundColor: '#e4e4e4',
    },
    headerRight: <Text>...</Text>,
  };

  render() {
    return (
      <View>
        <Card transparent>
          <CardItem>
            <Body>
              <Text>Information details Jobs</Text>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  }
}
export default JobDetailsScreen;
