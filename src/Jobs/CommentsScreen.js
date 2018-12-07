import React, { Component } from 'react';
import { TouchableOpacity, RefreshControl, Image } from 'react-native';
import {
  Input,
  Content,
  Container,
  Icon,
  Item,
  Card,
  CardItem,
  Left,
  Body,
  Right,
  Text,
  Footer,
  FooterTab,
  Button,
  Thumbnail,
  View,
} from 'native-base';
import { CustomHeader, Loading } from '../utils/components';
import styles from './CommentsStyle';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import { LOG } from '../utils';

const IMAGE_PICKER_OPTIONS = {
  mediaType: 'photo',
  cameraType: 'back',
  noData: true,
  skipBackup: true,
};

class CommentsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRefreshing: false,
      selectedImage: {},
      comments: [],
      message: '',
      jobId: props.navigation.getParam('jobId', null),
    };
  }

  componentDidMount() {
    this.getJobCommentsSubscription = jobStore.subscribe(
      'GetJobComments',
      this.getJobCommentsHandler,
    );
    this.commentJobSubscription = jobStore.subscribe(
      'CommentJob',
      this.commentJobHandler,
    );
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.firstLoad();
  }

  componentWillUnmount() {
    this.getJobCommentsSubscription.unsubscribe();
    this.commentJobSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  commentJobHandler = () => {
    this.setState({ isLoading: false, message: '', selectedImage: {} });
    this.getJobComments();
  };

  getJobCommentsHandler = (data) => {
    this.setState({
      isLoading: false,
      isRefreshing: false,
      comments: data.results,
    });
  };

  errorHandler = () => {
    this.setState({ isLoading: false, isRefreshing: false });
  };

  render() {
    const { t } = this.props;

    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}

        <CustomHeader leftButton={'goBack'} title={t('JOBS.jobComments')} />

        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.refreshData}
            />
          }
          padder>
          {Array.isArray(this.state.comments)
            ? this.state.comments.map((comment) => (
              <Card key={comment.id}>
                <CardItem>
                  <Left>
                    <Body>
                      {comment.owner ? (
                        <Text>{`${comment.owner.first_name} ${
                          comment.owner.last_name
                        }`}</Text>
                      ) : null}
                      <Text note>{comment.message}</Text>
                    </Body>
                  </Left>
                </CardItem>
                {Array.isArray(comment.image)
                  ? comment.image.map((image) => (
                    <CardItem key={image.id} cardBody>
                      <Image
                        source={{ uri: image.image_comment }}
                        style={{ height: 200, flex: 1 }}
                      />
                    </CardItem>
                  ))
                  : null}
                <CardItem>
                  <Left />
                  <Body />
                  <Right>
                    <Text note>
                      {moment(comment.created)
                        .tz(moment.tz.guess())
                        .format('LT')}
                    </Text>
                  </Right>
                </CardItem>
              </Card>
            ))
            : null}
        </Content>

        <Footer>
          <FooterTab>
            <Button onPress={this.selectImage} dark transparent>
              <Icon active name="md-image" />
            </Button>
            <Button onPress={this.openCamera} dark transparent>
              <Icon active name="md-camera" />
            </Button>
            <Button dark transparent>
              <Icon active name="md-attach" />
            </Button>
          </FooterTab>
        </Footer>
        <Item style={styles.item}>
          <Input
            multiline
            returnKeyType={'next'}
            value={this.state.message}
            placeholder={t('JOBS.typeMessage')}
            onChangeText={(text) => this.setState({ message: text })}
          />
          <TouchableOpacity onPress={this.addComment}>
            <Icon active name="md-send" style={styles.iconBlue} />
          </TouchableOpacity>
        </Item>
        {this.state.selectedImage.uri ? (
          <View style={styles.imageView}>
            <TouchableOpacity onPress={this.deleteImage}>
              <Thumbnail
                style={styles.thumbnail}
                source={this.state.selectedImage}
              />
              <Icon name="md-close-circle" style={styles.iconClose} />
            </TouchableOpacity>
          </View>
        ) : null}
      </Container>
    );
  }

  firstLoad = () => {
    this.setState({ isLoading: true }, () => {
      this.getJobComments();
    });
  };

  refreshData = () => {
    this.setState({ isRefreshing: true }, () => {
      this.getJobComments();
    });
  };

  getJobComments = () => {
    jobActions.getJobComments(this.state.jobId);
  };

  addComment = () => {
    let files = undefined;

    if (this.state.selectedImage.uri) {
      files = [this.state.selectedImage];
    }

    this.setState({ isLoading: true }, () => {
      jobActions.commentJob(this.state.jobId, this.state.message, files);
    });
  };

  selectImage = () => {
    ImagePicker.launchImageLibrary(
      IMAGE_PICKER_OPTIONS,
      this.handleImagePickerResponse,
    );
  };

  openCamera = () => {
    ImagePicker.launchCamera(
      IMAGE_PICKER_OPTIONS,
      this.handleImagePickerResponse,
    );
  };

  /**
   * Handle react-native-image-picker response and set the selected image
   * @param  {object} response A react-native-image-picker response
   */
  handleImagePickerResponse = (response) => {
    if (response.didCancel) {
      LOG(this, 'User cancelled image picker');
    } else if (response.error) {
      LOG(this, `ImagePicker Error: ${response.error}`);
    } else if (response.customButton) {
      LOG(this, `User tapped custom button: ${response.customButton}`);
    } else {
      const selectedImage = {
        uri: response.uri /*`data:image/jpeg;base64,${response.data}`*/,
        type:
          response.type ||
          `image/${
            response.fileName.split('.')[
              response.fileName.split('.').length - 1
            ]
          }`,
        name: response.fileName,
      };

      this.setState({ selectedImage });
    }
  };

  deleteImage = () => {
    this.setState({ selectedImage: {} });
  };
}

export default withNamespaces()(CommentsScreen);
