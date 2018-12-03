import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Content, Container, Textarea, Button, Text } from 'native-base';
import { CustomHeader, Loading } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import { LOG } from '../utils';

class RejectJobScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      job: props.navigation.getParam('job', {}),
      message: '',
    };
  }

  componentDidMount() {
    this.rejectJobSubscription = jobStore.subscribe(
      'RejectJob',
      this.rejectJobHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.rejectJobSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  rejectJobHandler = () => {
    this.setState({ isLoading: false });
    this.props.navigation.goBack();
  };

  errorHandler = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.rejectJob')} />

        <Content>
          <Text>{t('JOBS.whyRejecting')}</Text>

          <Textarea
            value={this.state.message}
            placeholder={t('JOBS.rejectReason')}
            onChangeText={(text) => this.setState({ message: text })}
            rowSpan={5}
            bordered
          />

          <Button onPress={this.rejectJob} />
        </Content>
      </Container>
    );
  }

  RejectJob = () => {
    if (!this.state.job || !this.state.job.title) return;

    Alert.alert(
      this.props.t('JOBS.wantToRejectJob'),
      this.state.job.title,
      [
        {
          text: this.props.t('APP.cancel'),
          onPress: () => {
            LOG(this, 'Cancel rejectJob');
          },
        },
        {
          text: this.props.t('JOBS.reject'),
          onPress: () => {
            this.setState({ isLoading: true }, () => {
              jobActions.rejectJob(this.state.job.id, this.state.messsage);
            });
          },
        },
      ],
      { cancelable: false },
    );
  };
}

export default withNamespaces()(RejectJobScreen);
