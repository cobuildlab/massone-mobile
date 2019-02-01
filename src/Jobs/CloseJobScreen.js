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
  View,
  Icon,
} from 'native-base';
import { BLUE_MAIN } from '../constants/colorPalette';
import { CustomHeader, Loading } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import { LOG } from '../utils';
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
    this.selectPartSubscription = jobStore.subscribe(
      'SelectPart',
      this.selectPartHandler,
    );
    this.signatureSubscription = jobStore.subscribe(
      'Signature',
      this.signatureHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);
  }

  componentWillUnmount() {
    this.closeJobSubscription.unsubscribe();
    this.selectPartSubscription.unsubscribe();
    this.signatureSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  closeJobHandler = () => {
    this.setState({ isLoading: false });
    this.props.navigation.goBack();
  };

  selectPartHandler = (part) => {
    this.selectPart(part);
  };

  signatureHandler = (signature) => {
    this.setState({ signature });
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
                style={styles.listItemMargin}
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
            <ListItem button noIndentBodyText onPress={this.goToSearchParts}>
              <Body>
                <Text>{t('JOBS.partsPlaceholder')}</Text>
                {Array.isArray(this.state.parts)
                  ? this.state.parts.map((part) => (
                    <Button
                      key={part.id}
                      onPress={() => this.deletePart(part)}
                      style={styles.partButton}
                      primary
                      iconRight
                      transparent>
                      <Text>{part.item}</Text>
                      <Icon name="md-close" />
                    </Button>
                  ))
                  : null}
              </Body>
              <Button
                onPress={this.goToSearchParts}
                style={styles.listItemMargin}
                primary>
                <Text>{t('JOBS.search')}</Text>
              </Button>
            </ListItem>
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
            <ListItem
              style={styles.signatureItem}
              button
              noBorder
              noIndentBodyText
              onPress={this.goToSignature}>
              <Body>
                <Text>{t('JOBS.signature')}</Text>
              </Body>
              {this.state.signature ? (
                <View style={styles.signatureButtons}>
                  <Button onPress={this.goToSignature} danger>
                    <Text>{t('JOBS.edit')}</Text>
                  </Button>
                  <Button
                    style={styles.buttonMargin}
                    onPress={this.goToViewImage}
                    primary>
                    <Text>{t('JOBS.view')}</Text>
                  </Button>
                </View>
              ) : (
                <Button onPress={this.goToSignature} primary>
                  <Text>{t('JOBS.add')}</Text>
                </Button>
              )}
            </ListItem>
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

  goToSignature = () => {
    this.props.navigation.navigate('Signature');
  };

  selectPart = (part) => {
    if (!part) return;

    let alreadyIn = false;
    for (const partIn of this.state.parts) {
      if (part.id === partIn.id) {
        alreadyIn = true;
        break;
      }
    }

    if (!alreadyIn) {
      const parts = this.state.parts;
      parts.push(part);
      this.setState({ parts });
    }
  };

  deletePart = (part) => {
    if (!part) return;

    const parts = this.state.parts.filter((partIn) => part.id !== partIn.id);

    this.setState({ parts });
  };

  goToSearchParts = () => {
    this.props.navigation.navigate('SearchParts');
  };

  goToViewImage = () => {
    if (!this.state.signature) return;
    this.props.navigation.navigate('Image', {
      image: {
        image_comment: `data:image/jpeg;base64,${this.state.signature}`,
      },
    });
  };

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
              this.state.parts.map((part) => part.id),
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
