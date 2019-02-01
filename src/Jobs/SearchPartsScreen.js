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
import { BLUE_MAIN } from '../constants/colorPalette';
import { CustomHeader, Loading } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import { debounce } from '../utils';

class SearchPartsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoadingParts: false,
      search: '',
      parts: [],
    };
  }

  componentDidMount() {
    this.getPartsSubscription = jobStore.subscribe(
      'GetParts',
      this.getPartsHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.getPartsSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  getPartsHandler = (data) => {
    this.setState({ parts: data.results, isLoadingParts: false });
  };

  errorHandler = () => {
    this.setState({ isLoading: false, isLoadingParts: false });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.searchParts')} />

        <Content>
          <Form>
            <Item stackedLabel>
              <Label>{t('JOBS.parts')}</Label>
              <Input
                placeholder={t('JOBS.partsPlaceholder')}
                onChangeText={this.getParts}
              />
            </Item>

            {this.state.isLoadingParts ? <Spinner color={BLUE_MAIN} /> : null}

            {Array.isArray(this.state.parts) && this.state.parts.length
              ? this.state.parts.map((part) => (
                <ListItem
                  key={part.id}
                  button
                  onPress={() => this.selectPart(part)}>
                  <Body>
                    <Text>{part.item}</Text>
                    <Text note>{part.description}</Text>
                  </Body>
                  <Right>
                    <Button transparent primary>
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

  getParts = debounce((search) => {
    this.setState({ isLoadingParts: true }, () => {
      jobActions.getParts(search);
    });
  }, 400);

  selectPart = (part) => {
    jobActions.selectPart(part);
    this.props.navigation.goBack();
  };
}

export default withNamespaces()(SearchPartsScreen);
