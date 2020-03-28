import React, { Component } from 'react';
import {
  Content,
  Container,
  Button,
  Text,
  H3,
  // H2,
  Item,
  Input,
  ListItem,
  Body,
  Right,
  // Icon,
  Label,
  Form,
  Spinner,
} from 'native-base';
import { BLUE_MAIN } from '../../constants/colorPalette';
import { CustomHeader } from '../../utils/components';
import { withNamespaces } from 'react-i18next';
import LastFiveJobs from './modalLastJobs';
import * as jobActions from '../actions';
import styles from './styles';
import jobStore from '../jobStore';
import { debounce } from '../../utils';
import { TouchableOpacity } from 'react-native-gesture-handler';

class SearchCustomerScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      modalVisible: false,
      locations: [],
      indexLocation: null,
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

  toggleModal = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  setInfo = (ix) => {
    this.setState(
      {
        indexLocation: ix,
      },
      () => {
        this.toggleModal();
      },
    );
  };

  render() {
    const { t } = this.props;
    const { modalVisible, locations, indexLocation } = this.state;
    console.log('LOCATIONSS ', this.state.locations);
    console.log('INDEXX ', indexLocation);
    return (
      <Container>
        <CustomHeader leftButton={'goBack'} title={t('JOBS.searchCustomer')} />
        {indexLocation !== null ? (
          <LastFiveJobs
            t={t}
            jobs={locations ? locations[indexLocation].jobs && locations[indexLocation].jobs : []}
            modalVisible={modalVisible}
            setModal={this.toggleModal}
          />
        ) : null}
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>{t('JOBS.customers')}</Label>
              <Input
                placeholder={t('JOBS.searchCustomerPlaceholder')}
                onChangeText={this.getLocations}
              />
            </Item>

            {this.state.isLoading ? <Spinner color={BLUE_MAIN} /> : null}
            {Array.isArray(this.state.locations) && this.state.locations.length
              ? this.state.locations.map((location, ix) => (
                <>
                  <ListItem key={location.id} button>
                    <Body>
                      <H3>{location.name}</H3>
                      <Text>{`${location.address},${location.city}, ${location.state}`}</Text>
                      <TouchableOpacity onPress={() => this.setInfo(ix)}>
                        <Text style={[styles.textLast]}>The last five Jobs</Text>
                      </TouchableOpacity>
                    </Body>
                    <Right>
                      <Button title={'ADD'} onPress={() => this.selectLocation(location)} primary>
                        <Text>{t('JOBS.add')}</Text>
                      </Button>
                    </Right>
                  </ListItem>
                </>
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

export default withNamespaces()(SearchCustomerScreen);
