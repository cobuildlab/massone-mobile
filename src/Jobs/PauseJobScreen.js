import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Content, Container, Textarea, Button, Text, View } from 'native-base';
import { CustomHeader, CustomToast, Loading } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import { LOG } from '../utils';
import styles from './PauseJobStyle';

class PauseJobScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      job: props.navigation.getParam('job', {}),
      message: '',
    };
  }

  componentDidMount() {
    this.pauseJobSubscription = jobStore.subscribe(
      'PauseJob',
      this.pauseJobHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.pauseJobSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  pauseJobHandler = () => {
    this.setState({ isLoading: false });
    CustomToast(this.props.t('JOBS.jobPaused'));
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

        <CustomHeader leftButton={'goBack'} title={t('JOBS.pauseJob')} />

        <Content contentContainerStyle={styles.content}>
          <View style={styles.viewText}>
            <Text style={styles.text}>{`${t('JOBS.whyPausing')}:`}</Text>
            <Text style={styles.textJob}>{this.state.job.title}</Text>
          </View>

          <View style={styles.viewTextArea}>
            <Textarea
              autoFocus
              value={this.state.message}
              placeholder={t('JOBS.pauseReason')}
              onChangeText={(text) => this.setState({ message: text })}
              rowSpan={5}
              bordered
            />
          </View>

          <Button primary block onPress={this.pauseJob}>
            <Text>{t('JOBS.pauseJob')}</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  pauseJob = () => {
    if (!this.state.job || !this.state.job.title) return;

    Alert.alert(
      this.props.t('JOBS.wantToPauseJob'),
      this.state.job.title,
      [
        {
          text: this.props.t('APP.cancel'),
          onPress: () => {
            LOG(this, 'Cancel pauseJob');
          },
        },
        {
          text: this.props.t('JOBS.pause'),
          onPress: () => {
            this.setState({ isLoading: true }, () => {
              jobActions.pauseJob(this.state.job.id, this.state.messsage);
            });
          },
        },
      ],
      { cancelable: false },
    );
  };
}

export default withNamespaces()(PauseJobScreen);
