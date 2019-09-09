import React from 'react';
import { Link } from 'react-router-dom';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { MessageBox } from './MessageBox';

const styles = {
  main: css`
    margin-top: 65px;
    margin-right: 34px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
  `,
  title: css`
    font-size: 28px;
    line-height: 33px;
    padding-top: 33px;
    margin-bottom: 34px;
    color: #000000;
  `,
  timestamp: css`
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    color: #979797;
    margin-right: 5px;
    margin-bottom: 0px;
    margin-top: 0px;
  `,
  username: css`
    font-size: 21px;
    line-height: 25px;
    margin-top: 5px;
    color: #979797;
  `,
  reply: css`
    margin-right: 38px;
    font-size: 28px;
    line-height: 33px;
    color: #000000;
  `,
  messageBox: css`
    height: 281px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    padding: 23px 18px;
  `,
  message: css`
    font-size: 28px;
    line-height: 33px;
    color: #979797;
  `,
  divider: css`
    border: 1px solid #d8d8d8;
  `,
  boxAndButton: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 38px;
  `,
  sendToCampaignButton: css`
    padding: 30px 30px;
    width: 100%;
    height: 91px;
    border: 1px solid blue;
    display: flex;
    justify-content: center;
    margin-bottom: 38px;
  `,
  timelineGroup: css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  timeline: css`
    flex-grow: 1;
    height: 1px;
    background-color: #9f9f9f;
  `,
  activityList: css`
    padding-left: 0;
  `,
};

const fakeData = {
  id: 67,
  userId: 2,
  notes: 'Campaign Admin added a contribution (64).',
  campaignId: 1,
  activityId: 64,
  activityType: 'contribution',
  createdAt: Date.now(),
};

const getActivities = activities => {
  const activityList = activities[0];
  return Object.values(activityList).map((activity, index) => {
    return (
      <div key={index}>
        <div css={styles.timelineGroup}>
          <h3
            css={styles.timestamp}
          >{`created at date here: ${fakeData.createdAt}`}</h3>
          {/* ^^^^ NEEDS REAL DATA */}
          <div css={styles.timeline} />
        </div>
        <p css={styles.username}>{activity.notes}</p>
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
  <div css={styles.main}>
    <hr css={styles.divider} />
    <h2 css={styles.title}>Transaction History</h2>
    <ul css={styles.activityList}>{getActivities([activitiesArray])}</ul>
    <MessageBox />
  </div>
);
