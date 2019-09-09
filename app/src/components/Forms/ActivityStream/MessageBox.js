import React from 'react';
import { Link } from 'react-router-dom';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const styles = {
  main: css`
    margin-top: 65px;
    margin-right: 34px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
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
};

export const MessageBox = () => (
  <>
    <div css={styles.timelineGroup}>
      <h2 css={styles.reply}>Reply</h2> <div css={styles.timeline} />
    </div>
    <div css={styles.boxAndButton}>
      <p css={styles.messageBox}>
        <span css={styles.message}>Message to Campaign</span>
      </p>
      <Link to="#" css={styles.sendToCampaignButton}>
        Submit Message to Campaign
      </Link>
    </div>
  </>
);
