import React from 'react';
import { connect } from 'react-redux';
import { parseFromTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { getActivities } from '../../../state/ducks/activities';
import MessageBox from './MessageBox';
import { activitySectionStyles } from '../../../assets/styles/forms.styles';

const AList = ({ activities }) => {
  return Object.values(activities).map((activity, index) => {
    const newDate = format(
      new Date(
        parseFromTimeZone(activity.createdAt, {
          timeZone: 'America/Los_Angeles',
        })
      ),
      'MM-DD-YYYY @ hh:mma'
    );
    return (
      <div key={index}>
        <div css={activitySectionStyles.timelineGroup}>
          <p css={activitySectionStyles.timestamp}>
            {/* {`$ */}
            {newDate}
            {/* ${capitalizedActivity} Activity`} */}
          </p>
          <div css={activitySectionStyles.timeline} />
        </div>
        <p css={activitySectionStyles.username}>{activity.notes}</p>
        {/* OR some version of... 
            <p css={activitySectionStyles.username}>
              {`${activity.username} added a ${typeOfActivity}`}
            </p> */}
      </div>
    );
  });
};

export const ActivityList = connect(state => ({
  activities: getActivities(state),
}))(AList);

export const ActivitySection = ({ id, type }) => (
  <div css={activitySectionStyles.main}>
    <hr css={activitySectionStyles.divider} />
    <h3 css={activitySectionStyles.title}>Transaction History</h3>
    <ul css={activitySectionStyles.activityList}>
      <ActivityList />
    </ul>
    <MessageBox id={id} type={type} />
  </div>
);
