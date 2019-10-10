import React from 'react';
import { connect } from 'react-redux';
import { parseFromTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Button, CircularProgress } from '@material-ui/core';
import {
  getActivities,
  getActivitiesByIdType,
  getActivtiesCount,
  getTotalCount,
} from '../../../state/ducks/activities';
import MessageBox from './MessageBox';
import { activitySectionStyles } from '../../../assets/styles/forms.styles';

class showMore extends React.Component {
  constructor(props) {
    super(props);
    const { expenditureId, contributionId, governmentId, campaignId } = props;
    const { initialPageSize = 5, perPage = 5 } = props;
    this.state = {
      perPage,
      page: 0,
      moreActivities: true,
    };
    props.getActivitiesByIdType(
      {
        expenditureId,
        contributionId,
        governmentId,
        campaignId,
        page: 0,
        perPage: initialPageSize,
      },
      true
    );
  }

  componentDidUpdate() {
    console.log(this.props.totalShowing, '<', this.props.totalActivites);
    if (this.props.totalShowing < this.props.totalActivites) {
      this.state.moreActivities = true;
    } else {
      this.state.moreActivities = false;
    }
  }

  showMore(all = false) {
    const {
      expenditureId,
      contributionId,
      governmentId,
      campaignId,
      totalShowing,
      totalActivites,
    } = this.props;
    this.props.getActivitiesByIdType({
      expenditureId,
      contributionId,
      governmentId,
      campaignId,
      page: this.state.page,
      perPage: all ? totalActivites : this.state.perPage + totalShowing,
    });
  }

  render() {
    const { totalShowing, totalActivites, isLoading } = this.props;
    return (
      <div>
        <span css={activitySectionStyles.status}>
          1 - {totalShowing} of {`${totalActivites}  `}
        </span>
        <Button
          but
          disabled={!!(!this.state.moreActivities || isLoading)}
          onClick={() => {
            this.showMore();
          }}
        >
          Show More
        </Button>
        <Button
          but
          disabled={!!(!this.state.moreActivities || isLoading)}
          onClick={() => {
            this.showMore(true);
          }}
        >
          Show All
        </Button>
        {isLoading ? <CircularProgress size={20} /> : null}
      </div>
    );
  }
}

const ShowMore = connect(
  state => ({
    activities: getActivities(state),
    totalShowing: getActivtiesCount(state),
    activityList: state.activities.list,
    totalActivites: getTotalCount(state),
    isLoading: state.activities.isLoading,
  }),
  dispatch => ({
    getActivitiesByIdType: id => dispatch(getActivitiesByIdType(id)),
  })
)(showMore);

const activityList = ({
  activities,
  expenditureId,
  contributionId,
  governmentId,
  campaignId,
}) => {
  const id = { expenditureId, contributionId, governmentId, campaignId };
  return (
    <div>
      <ul css={activitySectionStyles.activityList}>
        {Object.values(activities).map((activity, index) => {
          const newDate = format(
            new Date(
              parseFromTimeZone(activity.createdAt, {
                timeZone: 'America/Los_Angeles',
              })
            ),
            'MM-DD-YYYY @ hh:mma'
          );
          return (
            <li
              key={index}
              style={{
                listStyleType: 'none',
              }}
            >
              <div css={activitySectionStyles.timelineGroup}>
                <p css={activitySectionStyles.timestamp}>{newDate}</p>
                <div css={activitySectionStyles.timeline} />
              </div>
              <p css={activitySectionStyles.username}>{activity.notes}</p>
            </li>
          );
        })}
      </ul>
      <ShowMore {...id} />
    </div>
  );
};

export const ActivityList = connect(state => ({
  activities: getActivities(state),
}))(activityList);

export const ActivitySection = props => {
  return (
    <div css={activitySectionStyles.main}>
      <hr css={activitySectionStyles.divider} />
      <h3 css={activitySectionStyles.title}>Transaction History</h3>
      <ul css={activitySectionStyles.activityList}>
        <ActivityList {...props} />
      </ul>
      <MessageBox {...props} />
    </div>
  );
};
