import React, { Component } from 'react';
import { Alert, RefreshControl } from 'react-native';
import { Content, Container, Textarea, Button, Text, View, Picker, Icon } from 'native-base';
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
      isRefreshing: false,
      job: props.navigation.getParam('job', {}),
      pauseJobReason: Object.assign([], jobStore.getState('GetPauseJobReason')),
      reasonId: null,
      message: '',
    };
  }

  componentDidMount() {
    this.pauseJobSubscription = jobStore.subscribe('PauseJob', this.pauseJobHandler);
    this.getPauseJobReasonSubscription = jobStore.subscribe(
      'GetPauseJobReason',
      this.getPauseJobReasonHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.loadData();
  }

  componentWillUnmount() {
    this.pauseJobSubscription.unsubscribe();
    this.getPauseJobReasonSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  pauseJobHandler = (data) => {
    this.setState({ isLoading: false, isRefreshing: false });
    CustomToast(data.detail);
    this.props.navigation.goBack();
  };

  getPauseJobReasonHandler = (pauseJobReason) => {
    this.setState({ pauseJobReason, isLoading: false, isRefreshing: false });
  };

  errorHandler = () => {
    this.setState({ isLoading: false, isRefreshing: false });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.pauseJob')} />

        <Content
          refreshControl={
            <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refreshData} />
          }
          contentContainerStyle={styles.content}>
          <View style={styles.viewText}>
            <Text style={styles.text}>{`${t('JOBS.whyPausing')}:`}</Text>
            <Text style={styles.textJob}>{this.state.job.title}</Text>
          </View>

          {Array.isArray(this.state.pauseJobReason) ? (
            <Picker
              placeholder={t('JOBS.selectReason')}
              headerBackButtonText={t('APP.goBack')}
              iosHeader={t('JOBS.selectReason')}
              iosIcon={<Icon name="ios-arrow-down" />}
              style={styles.pauseReasonPicker}
              selectedValue={this.state.reasonId}
              onValueChange={this.onReasonChange}>
              <Picker.Item label={t('JOBS.selectReason')} value={null} />
              {this.state.pauseJobReason.map((reason) => (
                <Picker.Item key={reason.id} label={reason.reason} value={reason.id} />
              ))}
            </Picker>
          ) : null}

          <View style={styles.viewTextArea}>
            <Textarea
              value={this.state.message}
              placeholder={t('JOBS.optionalComments')}
              onChangeText={(text) => this.setState({ message: text, fieldsEmpty: false })}
              rowSpan={5}
              autoCorrect={false}
              maxLength={200}
              bordered
            />
            <Text style={styles.textCount}>{this.state.message.length}/200</Text>
          </View>

          <Button title={'Pause Job'} primary block onPress={this.pauseJob}>
            <Text>{t('JOBS.pauseJob')}</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  loadData = () => {
    if (!Array.isArray(this.state.pauseJobReason) || !this.state.pauseJobReason.length) {
      this.setState({ isLoading: true }, () => {
        this.getPauseJobReason();
      });
    }
  };

  refreshData = () => {
    this.setState({ isRefreshing: true }, () => {
      this.getPauseJobReason();
    });
  };

  onReasonChange = (id) => {
    this.setState({
      reasonId: id,
    });
  };

  getPauseJobReason = () => {
    jobActions.getPauseJobReason();
  };

  pauseJob = () => {
    if (this.state.job && this.state.job.title && this.state.reasonId) {
      return Alert.alert(this.props.t('JOBS.wantToPauseJob'), this.state.job.title, [
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
              jobActions.pauseJob(this.state.job.id, this.state.message, this.state.reasonId);
            });
          },
        },
      ]);
    }
    return CustomToast('Complete all fields', 'warning');
  };
}

export default withNamespaces()(PauseJobScreen);
