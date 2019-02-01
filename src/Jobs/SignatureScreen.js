import React, { Component } from 'react';
import {
  Content,
  Container,
  Button,
  Text,
  Footer,
  FooterTab,
} from 'native-base';
import { CustomHeader } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import SignatureCapture from 'react-native-signature-capture';
import { BLUE_MAIN } from '../constants/colorPalette';
import { WARN } from '../utils';

class SignatureScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        <CustomHeader leftButton={'goBack'} title={t('JOBS.signature')} />

        <Content contentContainerStyle={{ flex: 1 }}>
          <Text
            style={{
              color: BLUE_MAIN,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 20,
              textAlign: 'center',
            }}>
            {t('JOBS.writeSignature')}
          </Text>

          <SignatureCapture
            style={{ flex: 1 }}
            ref={(signature) => (this.signature = signature)}
            onSaveEvent={this.onSaveSign}
            saveImageFileInExtStorage={false}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode={'portrait'}
          />
        </Content>

        <Footer>
          <FooterTab>
            <Button onPress={this.resetSign} danger transparent>
              <Text>{t('JOBS.resetSignature')}</Text>
            </Button>
          </FooterTab>
          <FooterTab>
            <Button onPress={this.saveSign} primary transparent>
              <Text>{t('JOBS.saveSignature')}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  saveSign = () => {
    try {
      this.signature.saveImage();
    } catch (e) {
      WARN(this, `saveSignError: ${e}`);
    }
  };

  resetSign = () => {
    try {
      this.signature.resetImage();
    } catch (e) {
      WARN(this, `saveSignError: ${e}`);
    }
  };

  onSaveSign = (result) => {
    jobActions.signature(result.encoded);
    this.props.navigation.goBack();
  };
}

export default withNamespaces()(SignatureScreen);
