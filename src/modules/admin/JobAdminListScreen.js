import React from 'react';
import { Loading } from '../../utils/components';
import { Header, Content, Accordion, Container } from 'native-base';

const dataArray = [
  { title: 'First Element', content: 'Lorem ipsum dolor sit amet' },
  { title: 'Second Element', content: 'Lorem ipsum dolor sit amet' },
  { title: 'Third Element', content: 'Lorem ipsum dolor sit amet' },
];

class JobAdminListScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.rowRefs = [];
    this.selectedRow;
    this.state = {
      isLoading: false,
      isRefreshing: false,
      isLoadingPage: false,
      emptyJobs: false,
      nextUrl: '',
      jobs: [],
    };
  }

  render() {
    return (
      <Container>
        {this.state.isLoading ? <Loading /> : null}
        <Header />
        <Content padder>
          <Accordion dataArray={dataArray} expanded={0} />
        </Content>
      </Container>
    );
  }
}

export default JobAdminListScreen;
