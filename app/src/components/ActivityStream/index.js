import React from "react";
import { Link } from "react-router-dom";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const styles = {
  title: css`
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 28px;
    line-height: 33px;
    padding-top: 33px;
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
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 21px;
    line-height: 25px;
    margin-top: 5px;
    color: #979797;
  `,
  reply: css`
    margin-right: 38px;
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
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
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
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
    padding: 10px 30px;
    border: 1px solid blue;
    display: flex;
    justify-content: center;
    align-self: center;
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
  `
};

// MOCK DATA (I don't know the real shape) - VALUES NEED TO BE PULLED IN
let created = {
  timestamp: "07/12/2019",
  username: "User Name"
};
let submitted = {
  timestamp: "07/23/2019",
  username: "User3 Name"
};
let submissionResponse = {
  timestamp: "07/12/2019",
  username: "User2 Name",
  responseMessage:
    "This contribution looks like it's missing the attestation document."
};

let pretendActivities = [created, submitted, submissionResponse];
console.log({ pretendActivities });

const ActivityStream = () => {
  return (
    <div css={styles}>
      <hr css={styles.divider} />
      <h2 css={styles.title}>Transaction History</h2>
      <div css={styles.timelineGroup}>
        <p css={styles.timestamp}>{created.timestamp}</p>
        <div css={styles.timeline} />
      </div>
      <p css={styles.username}>{`Created by ${created.username}`}</p>

      <div css={styles.timelineGroup}>
        <p css={styles.timestamp}>{submitted.timestamp}</p>
        <div css={styles.timeline} />
      </div>
      <p css={styles.username}>{`Submitted for review by ${
        submitted.username
      }`}</p>

      <div css={styles.timelineGroup}>
        <p css={styles.timestamp}>{submissionResponse.timestamp}</p>
        <div css={styles.timeline} />
      </div>
      <p css={styles.username}>{submissionResponse.username}</p>
      <p css={styles.reply}>{submissionResponse.responseMessage}</p>

      <p css={styles.reply}>Reply</p>
      <div css={styles.boxAndButton}>
        <p css={styles.messageBox}>
          <span css={styles.message}>Message to Campaign</span>
        </p>
        <Link to={"#"} css={styles.sendToCampaignButton}>
          Submit Message to Campaign
        </Link>
      </div>
    </div>
  );
};

export default ActivityStream;
