import React, { Component } from 'react';
import {
  Content,
  Container,
  Button,
  Text,
  Item,
  Input,
  ListItem,
  Body,
  Right,
  Icon,
  Label,
  Form,
  Spinner,
} from 'native-base';
import { BLUE_MAIN } from '../../constants/colorPalette';
import { CustomHeader } from '../../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from '../actions';
import jobStore from '../jobStore';
import { debounce } from '../../utils';

class SearchLocationScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      locations: [],
    };
  }

  componentDidMount() {
    this.searchLocationsSubscription = jobStore.subscribe(
      'SearchLocations',
      this.searchLocationsHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.searchLocationsSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  searchLocationsHandler = (data) => {
    this.setState({ locations: data.results, isLoading: false });
  };

  errorHandler = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        <CustomHeader leftButton={'goBack'} title={t('JOBS.searchLocation')} />

        <Content>
          <Form>
            <Item stackedLabel>
              <Label>{t('JOBS.locations')}</Label>
              <Input
                placeholder={t('JOBS.searchLocation')}
                onChangeText={this.getLocations}
              />
            </Item>

            {this.state.isLoading ? <Spinner color={BLUE_MAIN} /> : null}

            {Array.isArray(this.state.locations) && this.state.locations.length
              ? this.state.locations.map((location) => (
                <ListItem
                  key={location.id}
                  button
                  onPress={() => this.selectLocation(location)}>
                  <Body>
                    <Text>{location.name}</Text>
                  </Body>
                  <Right>
                    <Button
                      onPress={() => this.selectLocation(location)}
                      transparent
                      primary>
                      <Icon name="md-add" />
                    </Button>
                  </Right>
                </ListItem>
              ))
              : null}
          </Form>
        </Content>
      </Container>
    );
  }

  getLocations = debounce((search) => {
    this.setState({ isLoading: true }, () => {
      jobActions.searchLocations(search);
    });
  }, 400);

  selectLocation = (location) => {
    jobActions.selectLocation(location);
    this.props.navigation.goBack();
  };
}

export default withNamespaces()(SearchLocationScreen);
