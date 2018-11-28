import React, { Component } from 'react';
// import { SafeAreaView } from 'react-navigation';
import { View } from 'react-native';
import { Body, Card, Text, CardItem, Button, Icon, Title } from 'native-base';
import styles from './JobDetailsStyle';
import { BLUE_MAIN, GRAY_MAIN } from '../constants/colorPalette';

class JobDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Details Jobs',
    headerStyle: {
      backgroundColor: GRAY_MAIN,
    },
    headerRight: (
      <Button transparent onPress={this.logout}>
        <Icon
          type="MaterialIcons"
          name="add"
          style={{ color: BLUE_MAIN, fontSize: 20 }}
        />
      </Button>
    ),
  };

  render() {
    return (
      <View>
        <Card transparent>
          <CardItem>
            <Body>
              <Title>Issue:</Title>
              <Text style={styles.textData}>Need ice</Text>
              <Title>Description:</Title>
              <Text style={styles.textData}>
                Lorem ipsum dolor sit amet, enim tortor, at ac ut, mauris
                rhoncus ut. A sollicitudin, tempor varius vitae. Id non, amet
                massa. Mauris metus elementum, suspendisse sapien dui, mattis
                nisl.
              </Text>
              <Title>Customer:</Title>
              <Text style={styles.textData}>C.C.C Sambil</Text>
              <Title>Contact:</Title>
              <Text style={styles.textDataContact}>
                <Text>Robert Smith</Text>
                <Text>
                  {' '}
                  <Icon
                    type="MaterialIcons"
                    name="phone"
                    style={{ color: BLUE_MAIN, fontSize: 14, marginTop: 5 }}
                  />{' '}
                  333-456789
                </Text>
              </Text>
              <Title>Type:</Title>
              <Text style={styles.textData}>Maintenance</Text>
              <Title>Status:</Title>
              <Text style={styles.textData}>Open</Text>
              <Title>Priority:</Title>
              <Text style={styles.textData}>Low</Text>
              <Title>Start Date:</Title>
              <Text style={styles.textData}>01/01/18 12:00 AM</Text>
              <Title>End Date:</Title>
              <Text style={styles.textData}>02/02/18 12:00 AM</Text>
              <View style={styles.viewBtnGroup}>
                <View style={styles.viewBtn}>
                  <Button primary block style={styles.btnLeft}>
                    <Text> Accept </Text>
                  </Button>
                </View>
                <View style={styles.viewBtn}>
                  <Button danger block style={styles.btnRight}>
                    <Text> Reject </Text>
                  </Button>
                </View>
              </View>
            </Body>
          </CardItem>
        </Card>
      </View>
    );
  }
}
export default JobDetailsScreen;
