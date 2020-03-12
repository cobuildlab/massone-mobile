import React, { Component } from 'react';
import { Content, Container } from 'native-base';
import { Image, StyleSheet } from 'react-native';
import { CustomHeader, Loading, CustomToast } from '../utils/components';
import { withNamespaces } from 'react-i18next';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
  },
});

class ImageScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      image: props.navigation.getParam('image', {}),
    };
  }

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.viewImage')} />

        <Content contentContainerStyle={styles.content}>
          <Image
            resizeMode={'contain'}
            source={{ uri: this.state.image.image_comment }}
            style={styles.image}
            onLoad={this.onImageLoad}
            onError={this.onImageError}
          />
        </Content>
      </Container>
    );
  }

  onImageLoad = () => {
    this.setState({ isLoading: false });
  };

  onImageError = (err) => {
    this.setState({ isLoading: false });
    CustomToast(err);
  };
}

export default withNamespaces()(ImageScreen);
