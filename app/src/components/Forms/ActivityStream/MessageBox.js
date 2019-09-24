import React from 'react';
import { Link } from 'react-router-dom';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { messageBoxStyles } from '../../../assets/styles/forms.styles';

export const MessageBox = () => (
  <>
    <div css={messageBoxStyles.timelineGroup}>
      <h2 css={messageBoxStyles.reply}>Reply</h2>
      <div css={messageBoxStyles.timeline} />
    </div>
    <div css={messageBoxStyles.boxAndButton}>
      <p css={messageBoxStyles.messageBox}>
        <span css={messageBoxStyles.message}>Message to Campaign</span>
      </p>
      <Link to="#" css={messageBoxStyles.sendToCampaignButton}>
        Submit Message to Campaign
      </Link>
    </div>
  </>
);
