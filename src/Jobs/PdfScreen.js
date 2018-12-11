import React, { Component } from 'react';
import { Content, Container } from 'native-base';
import { CustomHeader, Loading, CustomToast } from '../utils/components';
import { withNamespaces } from 'react-i18next';
import PDFView from 'react-native-view-pdf';

class PdfScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      file: props.navigation.getParam('file', {}),
    };
  }

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.viewPdf')} />

        <Content contentContainerStyle={{ flexGrow: 1 }}>
          <PDFView
            fadeInDuration={250.0}
            style={{ flex: 1 }}
            resource={this.state.file.file}
            resourceType={'url'}
            onLoad={this.onPdfLoad}
            onError={this.onPdfError}
          />
        </Content>
      </Container>
    );
  }

  onPdfLoad = () => {
    this.setState({ isLoading: false });
  };

  onPdfLoad = () => {
    this.setState({ isLoading: false });
  };

  errorHandler = (err) => {
    this.setState({ isLoading: false });
    CustomToast(err);
  };
}

export default withNamespaces()(PdfScreen);
