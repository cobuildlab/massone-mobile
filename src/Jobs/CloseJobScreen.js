import React, { Component } from 'react';
import { Alert } from 'react-native';
import {
  Content,
  Container,
  Button,
  Text,
  Footer,
  FooterTab,
  Form,
  Item,
  Input,
  Label,
  ListItem,
  CheckBox,
  Body,
} from 'native-base';
import { BLUE_MAIN } from '../constants/colorPalette';
import { CustomHeader, CustomToast, Loading } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import { LOG, debounce } from '../utils';
import styles from './CloseJobStyle';

class CloseJobScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingParts: false,
      partsList: undefined,
      job: props.navigation.getParam('job', {}),
      /*
      Service order form
       */
      equipment: '',
      completionNotes: '',
      workCompleted: false,
      workPerformed: '',
      parts: [],
      laborHours: null,
      laborOvertime: null,
      materials: '',
      equipmentUsed: '',
      refrigerantInventory: '',
      signature: '',
      /*
      Service order form
       */
    };
  }

  componentDidMount() {
    this.closeJobSubscription = jobStore.subscribe(
      'CloseJob',
      this.closeJobHandler,
    );
    this.getPartsSubscription = jobStore.subscribe(
      'GetParts',
      this.getPartsHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.closeJobSubscription.unsubscribe();
    this.getPartsSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  closeJobHandler = (data) => {
    this.setState({ isLoading: false });
    CustomToast(data.detail);
    this.props.navigation.goBack();
  };

  getPartsHandler = (data) => {
    this.setState({ partsList: data.results, isLoadingParts: false });
  };

  errorHandler = () => {
    this.setState({ isLoading: false, isLoadingParts: false });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.closeJob')} />

        <Content>
          <Form>
            <Item stackedLabel>
              <Label>{t('JOBS.equipment')}</Label>
              <Input
                value={this.state.equipment}
                placeholder={t('JOBS.equipmentPlaceHolder')}
                onChangeText={(equipment) => this.setState({ equipment })}
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.completionNotes')}</Label>
              <Input
                value={this.state.completionNotes}
                placeholder={t('JOBS.completionNotesPlaceholder')}
                onChangeText={(completionNotes) =>
                  this.setState({ completionNotes })
                }
              />
            </Item>
            <ListItem
              button
              onPress={() =>
                this.setState({ workCompleted: !this.state.workCompleted })
              }>
              <CheckBox
                style={styles.checkBox}
                checked={this.state.workCompleted}
                color={BLUE_MAIN}
              />
              <Body>
                <Text>{t('JOBS.workCompleted')}</Text>
              </Body>
            </ListItem>
            <Item stackedLabel>
              <Label>{t('JOBS.workPerformed')}</Label>
              <Input
                value={this.state.workPerformed}
                placeholder={t('JOBS.workPerformedPlaceholder')}
                onChangeText={(workPerformed) =>
                  this.setState({ workPerformed })
                }
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.parts')}</Label>
              <Input
                onChangeText={this.getParts}
                placeholder={t('JOBS.partsPlaceholder')}
              />
              {Array.isArray(this.state.partsList) ? (
                <Text>{this.state.partsList.length}</Text>
              ) : null}
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.laborHours')}</Label>
              <Input
                value={this.state.laborHours}
                keyboardType={'numeric'}
                placeholder={t('JOBS.laborHoursPlaceholder')}
                onChangeText={(laborHours) => this.setState({ laborHours })}
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.laborOvertime')}</Label>
              <Input
                value={this.state.laborOvertime}
                keyboardType={'numeric'}
                placeholder={t('JOBS.laborOvertimePlaceholder')}
                onChangeText={(laborOvertime) =>
                  this.setState({ laborOvertime })
                }
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.materials')}</Label>
              <Input
                value={this.state.materials}
                placeholder={t('JOBS.materialsPlaceholder')}
                onChangeText={(materials) => this.setState({ materials })}
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.equipmentUsed')}</Label>
              <Input
                value={this.state.equipmentUsed}
                placeholder={t('JOBS.equipmentUsedPlaceholder')}
                onChangeText={(equipmentUsed) =>
                  this.setState({ equipmentUsed })
                }
              />
            </Item>
            <Item stackedLabel>
              <Label>{t('JOBS.refrigerantInventory')}</Label>
              <Input
                value={this.state.refrigerantInventory}
                placeholder={t('JOBS.refrigerantInventoryPlaceholder')}
                onChangeText={(refrigerantInventory) =>
                  this.setState({ refrigerantInventory })
                }
              />
            </Item>
          </Form>
        </Content>

        <Footer>
          <FooterTab>
            <Button onPress={this.closeJob} primary transparent>
              <Text>{t('JOBS.closeJob')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  getParts = debounce((search) => {
    this.setState({ isLoadingParts: true }, () => {
      jobActions.getParts(search);
    });
  }, 400);

  closeJob = () => {
    if (!this.state.job || !this.state.job.title) return;

    Alert.alert(this.props.t('JOBS.wantToCloseJob'), this.state.job.title, [
      {
        text: this.props.t('APP.cancel'),
        onPress: () => {
          LOG(this, 'Cancel closeJob');
        },
      },
      {
        text: this.props.t('JOBS.close'),
        onPress: () => {
          this.setState({ isLoading: true }, () => {
            jobActions.closeJob(
              this.state.job.id,
              this.state.equipment || null,
              this.state.completionNotes || null,
              this.state.workCompleted,
              this.state.workPerformed,
              this.state.parts,
              Number(this.state.laborHours),
              Number(this.state.laborOvertime) || 0,
              this.state.materials || null,
              this.state.equipmentUsed || null,
              this.state.refrigerantInventory || null,
              this.state.signature,
            );
          });
        },
      },
    ]);
  };
}

export default withNamespaces()(CloseJobScreen);
