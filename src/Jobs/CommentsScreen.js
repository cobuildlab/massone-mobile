import React, { Component, Fragment } from 'react';
import { TouchableOpacity, Image, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Input,
  Spinner,
  Icon,
  Item,
  Card,
  CardItem,
  Left,
  Body,
  Right,
  Text,
  Button,
  Thumbnail,
  View,
} from 'native-base';
import { CustomHeader, Loading, CenteredText } from '../utils/components';
import styles from './CommentsStyle';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import { BLUE_MAIN } from '../constants/colorPalette';
import { LOG, WARN, sortByDate } from '../utils';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';

class CommentsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRefreshing: false,
      isLoadingPage: false,
      selectedImage: {},
      selectedFile: {},
      attachFile: false,
      comments: [],
      nextUrl: '',
      message: '',
      jobId: props.navigation.getParam('jobId', null),
    };
  }

  componentDidMount() {
    this.getJobCommentsSubscription = jobStore.subscribe(
      'GetJobComments',
      this.getJobCommentsHandler,
    );
    this.commentJobSubscription = jobStore.subscribe('CommentJob', this.commentJobHandler);
    this.jobStoreError = jobStore.subscribe('JobStoreError', this.errorHandler);

    this.firstLoad();
  }

  componentWillUnmount() {
    this.getJobCommentsSubscription.unsubscribe();
    this.commentJobSubscription.unsubscribe();
    this.jobStoreError.unsubscribe();
  }

  commentJobHandler = (data) => {
    const commentsCopy = this.state.comments;
    // push new comment and sort
    commentsCopy.push(data);
    const comments = sortByDate(commentsCopy);

    this.setState(
      {
        isLoading: false,
        message: '',
        selectedImage: {},
        selectedFile: {},
        comments,
      },
      () => {
        this.scrollToIndex();
      },
    );
  };

  getJobCommentsHandler = (data) => {
    // remove oldComments if refreshing
    const oldComments = this.state.isRefreshing ? [] : this.state.comments;
    // concat oldComments with new ones
    const comments = sortByDate(oldComments.concat(data.results));

    let emptyComments = false;
    if (!comments.length) emptyComments = true;

    this.setState({
      isLoading: false,
      isRefreshing: false,
      isLoadingPage: false,
      nextUrl: data.next,
      emptyComments,
      comments,
    });
  };

  errorHandler = () => {
    this.setState({
      isLoading: false,
      isRefreshing: false,
      isLoadingPage: false,
    });
  };

  visibleAttachFile = () => {
    const { attachFile } = this.state;
    this.setState({
      attachFile: !attachFile,
    });
  };

  render() {
    const { t } = this.props;
    const { attachFile } = this.state;

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' && 'padding'} style={[{ flex: 1 }]}>
        <CustomHeader leftButton={'goBack'} title={t('JOBS.jobComments')} />

        {this.state.isLoading ? <Loading /> : null}

        {this.state.emptyComments ? (
          <View style={styles.viewEmptyComment}>
            <CenteredText text={`${t('JOBS.emptyComments')}`} />
          </View>
        ) : null}
        {Array.isArray(this.state.comments) ? (
          <FlatList
            ref={(flatList) => (this.flatList = flatList)}
            style={[styles.flatList]}
            onRefresh={this.refreshData}
            refreshing={this.state.isRefreshing}
            onEndReached={this.getNextPage}
            data={this.state.comments}
            extraData={this.state}
            keyExtractor={(comment) => String(comment.id)}
            ListFooterComponent={() =>
              this.state.isLoadingPage ? <Spinner color={BLUE_MAIN} /> : null
            }
            renderItem={({ item: comment }) => (
              <Card>
                <CardItem>
                  <Left>
                    <Body>
                      {comment.owner ? (
                        <Text
                          style={
                            styles.nameEmployee
                          }>{`${comment.owner.first_name} ${comment.owner.last_name}`}</Text>
                      ) : null}

                      {comment.owner &&
                      Array.isArray(comment.owner.user_types) &&
                      comment.owner.user_types.length ? (
                          <Text>
                            {comment.owner.user_types.map((role, index, array) => {
                              const isLast = index === array.length - 1;

                              return (
                                <Fragment key={role}>
                                  <Text small style={styles.rolesText}>
                                    {role}
                                    {!isLast ? ', ' : ''}
                                  </Text>
                                </Fragment>
                              );
                            })}
                          </Text>
                        ) : null}

                      <Text note>{comment.message}</Text>
                    </Body>
                  </Left>
                </CardItem>
                {Array.isArray(comment.image)
                  ? comment.image.map((image) => (
                    <CardItem
                      key={image.id}
                      onPress={() => this.goToImageView(image)}
                      button
                      cardBody>
                      <Image
                        source={{ uri: image.image_comment }}
                        style={{ height: 220, flex: 1 }}
                      />
                    </CardItem>
                  ))
                  : null}
                <CardItem>
                  <Left>
                    {Array.isArray(comment.file)
                      ? comment.file.map((file) => (
                        <Button
                          title={'VIEW'}
                          bordered
                          iconRight
                          key={file.id}
                          transparent
                          onPress={() => this.goToPdfView(file)}>
                          <Text>{t('JOBS.viewPdf')}</Text>
                          <Icon name="md-document" />
                        </Button>
                      ))
                      : null}
                  </Left>

                  <Right>
                    <Text note>{moment(comment.created).fromNow()}</Text>
                  </Right>
                </CardItem>
              </Card>
            )}
          />
        ) : null}
        <View>
          {attachFile && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Button title={'SELECT IMAGE'} onPress={this.getPhotoFromPicker} dark transparent>
                <Icon active name="md-image" />
              </Button>
              <Button title={'OPEN CAMERA'} onPress={this.takePhotoFromPicker} dark transparent>
                <Icon active name="md-camera" />
              </Button>
            </View>
          )}
          <View style={[styles.boxComment, { marginBottom: isIphoneX() ? getBottomSpace() : 5 }]}>
            <Item style={styles.item}>
              <Input
                ref={(input) => (this.input = input)}
                multiline
                style={{
                  padding: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                autoCorrect={false}
                returnKeyType={'next'}
                value={this.state.message}
                placeholder={t('JOBS.typeMessage')}
                onChangeText={(text) => this.setState({ message: text })}
              />
              <TouchableOpacity onPress={this.visibleAttachFile}>
                <Icon name="attach-file" type="MaterialIcons" style={styles.iconBlue} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.addComment}>
                <Icon active name="md-send" style={styles.iconBlue} />
              </TouchableOpacity>
            </Item>
          </View>
          {this.state.selectedImage.uri ? (
            <View style={styles.imageView}>
              <TouchableOpacity onPress={this.deleteImage}>
                <Thumbnail style={styles.thumbnail} source={this.state.selectedImage} />
                <Icon name="md-close-circle" style={styles.iconClose} />
              </TouchableOpacity>
            </View>
          ) : null}
          {this.state.selectedFile.uri ? (
            <View style={styles.fileView}>
              <Button
                title={'CLOSE'}
                style={styles.fileButton}
                iconRight
                bordered
                onPress={this.deleteFile}>
                <Text style={styles.fileText}>{this.state.selectedFile.name}</Text>
                <Icon name="md-close-circle" />
              </Button>
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
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

  /**
   * This will get the url params for next page from the nextUrl
   * then it will call getJobComments with the nextUrl params
   */
  getNextPage = () => {
    if (!this.state.nextUrl) return;

    try {
      const urlParams = this.state.nextUrl
        ? this.state.nextUrl.split('/comments/')[this.state.nextUrl.split('/comments/').length - 1]
        : `?job=${this.state.jobId}`;

      this.setState({ isLoadingPage: true }, () => {
        this.getJobComments(urlParams);
      });
    } catch (e) {
      WARN(this, `getJobComments nextUrl Error: ${e}`);
    }
  };

  getJobComments = (urlParams = `?job=${this.state.jobId}`) => {
    jobActions.getJobComments(urlParams);
  };

  addComment = () => {
    let files = undefined;

    try {
      this.input._root.blur();
    } catch (err) {
      LOG(`Error on input blur() ${err}`);
    }

    if (this.state.selectedImage.uri) {
      files = [this.state.selectedImage];
    }

    if (this.state.selectedFile.uri) {
      files = [this.state.selectedFile];
    }

    this.setState({ isLoading: true }, () => {
      jobActions.commentJob(this.state.jobId, this.state.message, files);
    });
  };

  getPhotoFromPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      compressImageQuality: Platform.OS === 'ios' ? 2.5 : 1,
      width: 500,
      forceJpg: true,
      height: 600,
      cropping: true,
    })
      .then((image) => {
        // console.log('Imageee pickerrr ', image);
        const imageView = image.path;
        const ext = imageView.split('.').pop(); // Extract image extension
        const filename = `${moment().valueOf()}.${ext.toLowerCase()}`;
        const selectedImage = {
          uri: imageView,
          type: image.mime.toLowerCase(),
          name: filename,
          size: image.size,
        };
        // console.log('Selected image ', selectedImage);
        this.setState({
          selectedImage,
          attachFile: false,
        });
      })
      .catch((e) => console.log('Error ', e));
  };

  takePhotoFromPicker = () => {
    ImagePicker.openCamera({
      compressImageQuality: Platform.OS === 'ios' ? 2.5 : 1,
      mediaType: 'photo',
      width: 500,
      height: 600,
      cropping: true,
    })
      .then((image) => {
        // console.log(`DEBUG:AddPost:fromCAmera:`, image);
        const imageView = image.path;
        const ext = imageView.split('.').pop(); // Extract image extension
        const filename = `${moment().valueOf()}.${ext.toLowerCase()}`;
        const selectedImage = {
          uri: imageView,
          type: image.mime.toLowerCase(),
          name: filename,
          size: image.size,
        };
        // console.log('Selected image ', selectedImage);
        this.setState({
          selectedImage,
          attachFile: false,
        });
      })
      .catch((e) => console.log('Error ', e));
  };

  /**
   * Handle react-native-document-picker
   * response and set the selected file only, DONT USE FOR IMAGES
   *
   * @param  {object} response react-native-document-picker file
   * response with the uri, type & name
   */
  handleFile = (response) => {
    const selectedFile = {
      uri: response.uri,
      type: response.type,
      name: response.fileName,
    };

    this.setState({ selectedFile, selectedImage: {} });
  };

  deleteImage = () => {
    this.setState({ selectedImage: {} });
  };

  deleteFile = () => {
    this.setState({ selectedFile: {} });
  };

  goToPdfView = (file) => {
    this.props.navigation.navigate('Pdf', { file });
  };

  goToImageView = (image) => {
    this.props.navigation.navigate('Image', { image });
  };

  scrollToIndex = (index = 0) => {
    try {
      this.flatList.scrollToIndex({ index });
    } catch (err) {
      LOG(`Error on scrollToIndex ${err}`);
    }
  };
}

export default withNamespaces()(CommentsScreen);
