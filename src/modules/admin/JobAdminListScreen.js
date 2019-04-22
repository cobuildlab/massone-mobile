import React from 'react';
// import { Loading } from '../../utils/components';
import {
  Content,
  Accordion,
  Container,
  Text,
  Card,
  CardItem,
  Left,
} from 'native-base';
import { CustomHeader } from '../../utils/components';
import { withNamespaces } from 'react-i18next';
import jobStore from '../../Jobs/jobStore';
import { getJobsForAdmin } from '../../Jobs/actions';
import moment from 'moment';
import BoldText from '../../componets/BoldText';
import Loading from '../../utils/components/Loading';
import { GRAY_DARK, VIOLET } from '../../constants/colorPalette';

const WEEK_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 *
 */
class JobAdminListScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      jobs: [],
    };
  }

  componentWillUnmount(): void {
    this.jobsSubscription.unsubscribe();
  }

  componentDidMount() {
    this.jobsSubscription = jobStore.subscribe('GetJobsForAdmin', (state) => {
      const jobs = {};
      state.forEach((job) => {
        const created = moment(job.created);
        const weekNumber = created.format('w');
        if (jobs[weekNumber] === undefined) jobs[weekNumber] = [];
        jobs[weekNumber].push(job);
      });

      const weeksAsKeys = Object.keys(jobs);
      const dataArray = [];
      const thisWeek = moment().format('w');
      weeksAsKeys.forEach((week) => {
        let title = '';
        if (thisWeek === week) title = 'This Week';
        if (Number(week) === Number(thisWeek) - 1) title = 'Last Week';
        if (Number(week) === Number(thisWeek) - 2) title = '2 Weeks Ago';
        if (Number(week) === Number(thisWeek) + 1) title = 'Next Week';
        if (Number(week) === Number(thisWeek) + 2) title = 'Next 2 Weeks';
        dataArray.push({
          title,
          content: jobs[week],
        });
      });
      this.setState({
        isLoading: false,
        jobs: dataArray,
      });
    });
    getJobsForAdmin();
  }

  render() {
    const { t } = this.props;
    const { isLoading, jobs } = this.state;

    return (
      <Container>
        {isLoading ? <Loading /> : null}
        <CustomHeader leftButton={'openDrawer'} title={t('JOBS.jobs')} />
        <Content>
          <Accordion
            dataArray={jobs}
            expanded={2}
            renderContent={(item) => {
              console.log('debug', item);
              const { content: jobList } = item;
              console.log('debug', jobList);
              const data = {};
              jobList.forEach((job) => {
                const dayOfWeek = moment(job.created).format('d');
                if (data[dayOfWeek] === undefined) data[dayOfWeek] = [];
                data[dayOfWeek].push(job);
              });

              return WEEK_DAYS.map((day, pos) => {
                const todaysJobs = data[String(pos)] || [];

                if (todaysJobs.length === 0) return null;

                return (
                  <Card key={pos}>
                    <CardItem header>
                      <Text>{day}</Text>
                    </CardItem>
                    {todaysJobs.map((job, i) => {
                      return (
                        <Content key={i}>
                          <CardItem cardBody>
                            <Left>
                              <BoldText>{job.title}</BoldText>
                            </Left>
                          </CardItem>
                          <CardItem cardBody>
                            <Left>
                              <Text style={{ fontWeight: '700' }}>
                                <Text style={{ color: GRAY_DARK }}>
                                  {`${t('JOBS.fieldworker')}: `}
                                </Text>
                                <Text style={{ color: VIOLET }}>
                                  {job.employee && job.employee.firstName
                                    ? `${job.employee.first_name} ${
                                      job.employee.last_name
                                    }`
                                    : t('JOBS.notAsigned')}
                                </Text>
                              </Text>
                            </Left>
                          </CardItem>
                          <CardItem cardBody>
                            <Left>
                              <Text>
                                <Text
                                  style={{
                                    color: GRAY_DARK,
                                    fontWeight: '700',
                                  }}>
                                  {`${t('JOBS.createdAt')}: `}
                                </Text>
                                <Text>
                                  {job.created
                                    ? moment(job.created)
                                      .tz(moment.tz.guess())
                                      .format('L')
                                    : t('JOBS.notProvided')}
                                </Text>
                              </Text>
                            </Left>
                          </CardItem>
                          <CardItem cardBody style={{ marginBottom: 20 }}>
                            <Left>
                              <Text>
                                <Text
                                  style={{
                                    color: GRAY_DARK,
                                    fontWeight: '700',
                                  }}>
                                  {`${t('JOBS.type')} `}
                                </Text>
                                <Text>
                                  {job.job_type && job.job_type.name
                                    ? job.job_type.name
                                    : t('JOBS.notAsigned')}
                                </Text>
                              </Text>
                            </Left>
                          </CardItem>
                        </Content>
                      );
                    })}
                  </Card>
                );
              });
            }}
          />
        </Content>
      </Container>
    );
  }
}

export default withNamespaces()(JobAdminListScreen);
