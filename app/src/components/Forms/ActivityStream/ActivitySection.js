import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import MessageBox from './MessageBox';
import { activitySectionStyles } from '../../../assets/styles/forms.styles';

export const ActivityList = ({
  activitiesArray,
  contributionId,
  expenditureId,
  currentId = contributionId || expenditureId,
  filteredArray = [],
}) => {
  activitiesArray.forEach(activity => {
    // How to do more efficiently? KELLY
    if (activity.activityId === parseInt(currentId)) {
      console.log('matches: ', currentId, activity.activityId);
      filteredArray.push(activity);
      // }
      console.log({ filteredArray });
    }
  });

  return Object.values(filteredArray).map((activity, index) => {
    // const capitalizedActivity =
    //   activity.activityType.charAt(0).toUpperCase() +
    //   activity.activityType.slice(1);
    return (
      <div key={index}>
        <div css={activitySectionStyles.timelineGroup}>
          <p css={activitySectionStyles.timestamp}>
            {/* {`$ */}
            {activity.createdAt}
            {/* ${capitalizedActivity} Activity`} */}
          </p>
          <div css={activitySectionStyles.timeline} />
        </div>
        <p css={activitySectionStyles.username}>{activity.notes}</p>
      </div>
    );
  });
};

export const ActivitySection = ({
  formFields,
  initialValues,
  activitiesArray,
  contributionId,
  expenditureId,
  type,
  ...props
}) => (
  <div css={activitySectionStyles.main}>
    <hr css={activitySectionStyles.divider} />
    <h3 css={activitySectionStyles.title}>Transaction History</h3>
    <ul css={activitySectionStyles.activityList}>
      <ActivityList
        activitiesArray={activitiesArray}
        contributionId={contributionId}
        expenditureId={expenditureId}
      />
    </ul>
    <MessageBox
      contributionId={contributionId}
      expenditureId={expenditureId}
      type={type}
    />
  </div>
);
