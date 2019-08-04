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

class SearchEmployeeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      employees: [],
    };
  }

  componentDidMount() {
    this.searchEmployeesSubscription = jobStore.subscribe(
      'SearchEmployees',
      this.searchEmployeesHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.searchEmployeesSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  searchEmployeesHandler = (data) => {
    this.setState({ employees: data.results, isLoading: false });
  };

  errorHandler = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        <CustomHeader leftButton={'goBack'} title={t('JOBS.searchEmployee')} />

        <Content>
          <Form>
            <Item stackedLabel>
              <Label>{t('JOBS.employees')}</Label>
              <Input placeholder={t('JOBS.searchEmployee')} onChangeText={this.getEmployees} />
            </Item>

            {this.state.isLoading ? <Spinner color={BLUE_MAIN} /> : null}

            {Array.isArray(this.state.employees) && this.state.employees.length
              ? this.state.employees.map((employee) => (
                <ListItem key={employee.id} button onPress={() => this.selectEmployee(employee)}>
                  <Body>
                    <Text>{`${employee.first_name} ${employee.last_name}`}</Text>
                  </Body>
                  <Right>
                    <Button
                      title={'ADD'}
                      onPress={() => this.selectEmployee(employee)}
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

  getEmployees = debounce((search) => {
    this.setState({ isLoading: true }, () => {
      jobActions.searchEmployees(search);
    });
  }, 400);

  selectEmployee = (employee) => {
    jobActions.selectEmployee(employee);
    this.props.navigation.goBack();
  };
}

export default withNamespaces()(SearchEmployeeScreen);
