import React from 'react';
import { Link } from 'react-router-dom';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { MessageBox } from './MessageBox';
import { activitySectionStyles } from '../../../assets/styles/forms.styles';

const ActivityList = ({ activitiesArray, activities }) => {
  console.log(activities);
  const activityList = activitiesArray;
  return Object.values(activityList).map((activity, index) => {
    const capitalizedActivity =
      activity.activityType.charAt(0).toUpperCase() +
      activity.activityType.slice(1);
    return (
      <div key={index}>
        <div css={activitySectionStyles.timelineGroup}>
          <p css={activitySectionStyles.timestamp}>
            {`${activity.createdAt} ${capitalizedActivity} Activity`}
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
  // activitiesSwaggerResponse,
  activitiesArray,
  ...props
}) => (
  <div css={activitySectionStyles.main}>
    <hr css={activitySectionStyles.divider} />
    <h3 css={activitySectionStyles.title}>Transaction History</h3>
    <ul css={activitySectionStyles.activityList}>
      <ActivityList activitiesArray={activitiesArray} />
    </ul>
    <MessageBox />
  </div>
);
