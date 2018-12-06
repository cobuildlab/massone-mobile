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
} from 'native-base';
import { CustomHeader, Loading } from '../utils/components';
import styles from './CommentsStyle';
import { withNamespaces } from 'react-i18next';
import * as jobActions from './actions';
import jobStore from './jobStore';
import moment from 'moment';

class CommentsScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isRefreshing: false,
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
    this.setState({ isLoading: false, message: '' });
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
    this.setState({ isLoading: false });
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
                {comment.image_profile ? (
                  <CardItem cardBody>
                    <Image
                      source={{ uri: comment.image_profile }}
                      style={{ height: 200, flex: 1 }}
                    />
                  </CardItem>
                ) : null}
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
            <Button dark transparent>
              <Icon active name="md-image" />
            </Button>
            <Button dark transparent>
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
    this.setState({ isLoading: true }, () => {
      jobActions.commentJob(this.state.jobId, this.state.message);
    });
  };
}

export default withNamespaces()(CommentsScreen);
