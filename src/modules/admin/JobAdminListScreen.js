import React from 'react';
// import { Loading } from '../../utils/components';
import { Content, Accordion, Container, Text, Card, CardItem, Left } from 'native-base';
import { CustomHeader } from '../../utils/components';
import { withNamespaces } from 'react-i18next';
import jobStore from '../../Jobs/jobStore';
import { getJobsForAdmin } from '../../Jobs/actions';
import moment from 'moment';
import { H2 } from '../../shared/componets/text/H2';
import Loading from '../../utils/components/Loading';
import { log } from 'pure-logger';
import { GreenNormalText } from '../../shared/componets/text/GreenNormalText';

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
      const thisWeek = Number(moment().format('w'));
      weeksAsKeys.forEach((week) => {
        const weekAsNumber = Number(week);
        let title = '';
        if (thisWeek === weekAsNumber) title = 'This Week';
        if (weekAsNumber === thisWeek - 1) title = 'Last Week';
        if (weekAsNumber === thisWeek - 2) title = '2 Weeks Ago';
        if (weekAsNumber === thisWeek - 3) title = '3 Weeks Ago';
        if (weekAsNumber === thisWeek + 1) title = 'Next Week';
        if (weekAsNumber === thisWeek + 2) title = 'Next 2 Weeks';
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
    log('RENDER', jobs);
    return (
      <Container>
        {isLoading ? <Loading /> : null}
        <CustomHeader leftButton={'openDrawer'} title={t('JOBS.jobs')} />
        <Content>
          <Accordion
            dataArray={jobs}
            expanded={2}
            renderContent={(item) => {
              const { content: jobList } = item;
              const data = {};
              jobList.forEach((job) => {
                const dayOfWeek = moment(job.created).format('d');
                if (data[dayOfWeek] === undefined) data[dayOfWeek] = [];
                data[dayOfWeek].push(job);
              });

              return WEEK_DAYS.map((day, pos) => {
                const thisDayJobs = data[String(pos)] || [];
                // No Jobs For this Day
                if (thisDayJobs.length === 0) return null;
                const dateString = moment(thisDayJobs[0].created).format('LL');
                return (
                  <Card key={pos}>
                    <CardItem header>
                      <H2>{`${day}, ${dateString}`}</H2>
                    </CardItem>
                    {thisDayJobs.map((job, i) => {
                      console.log('DEBUG:job', job);
                      const jobType = job.job_type ? job.job_type.name : 'Not Assigned';
                      const employee =
                        job.employee && job.employee.first_name
                          ? `${job.employee.first_name} ${job.employee.last_name}`
                          : t('JOBS.notAsigned');
                      const created = job.created
                        ? moment(job.created)
                          .tz(moment.tz.guess())
                          .format('LLL')
                        : t('JOBS.notProvided');
                      return (
                        <Content key={i} padder>
                          <H2>{`JOB # ${job.id}`}</H2>
                          <CardItem cardBody>
                            <Left>
                              <Text style={{ fontWeight: '600' }}>{`${t('JOBS.job')}: `}</Text>
                              <Text>{job.title}</Text>
                            </Left>
                          </CardItem>
                          <CardItem cardBody>
                            <Left>
                              <Text style={{ fontWeight: '600' }}>{`${t(
                                'JOBS.fieldworker',
                              )}: `}</Text>
                              <Text>
                                <Text>{employee}</Text>
                              </Text>
                            </Left>
                          </CardItem>
                          <CardItem cardBody>
                            <Left>
                              <Text style={{ fontWeight: '600' }}>{`${t(
                                'JOBS.jobStatusAndType',
                              )}: `}</Text>
                              <GreenNormalText>{`${job.status} - ${jobType}`}</GreenNormalText>
                            </Left>
                          </CardItem>
                          <CardItem cardBody>
                            <Left>
                              <Text style={{ fontWeight: '600' }}>{`${t(
                                'JOBS.createdAt',
                              )}: `}</Text>
                              <Text>{created}</Text>
                            </Left>
                          </CardItem>
                          {job.completion_notes ? (
                            <CardItem cardBody>
                              <Left>
                                <Text>
                                  <Text style={{ fontWeight: '600' }}>{`${t(
                                    'JOBS.completionNotes',
                                  )}: `}</Text>
                                  <Text>{job.completion_notes}</Text>
                                </Text>
                              </Left>
                            </CardItem>
                          ) : null}
                          {job.worked_performed ? (
                            <CardItem cardBody>
                              <Left>
                                <Text>
                                  <Text style={{ fontWeight: '600' }}>{`${t(
                                    'JOBS.workPerformed',
                                  )}: `}</Text>
                                  <Text>{job.worked_performed}</Text>
                                </Text>
                              </Left>
                            </CardItem>
                          ) : null}
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
