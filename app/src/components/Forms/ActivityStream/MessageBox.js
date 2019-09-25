import React from 'react';
import { connect } from 'react-redux';
import { jsx } from '@emotion/core';
/** @jsx jsx */
import { Link } from 'react-router-dom';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import {
  updateExpenditure,
  postExpenditureComment,
} from '../../../state/ducks/expenditures';
import {
  updateContribution,
  postContributionComment,
} from '../../../state/ducks/contributions';
import { messageBoxStyles } from '../../../assets/styles/forms.styles';

const MessageBox = ({
  id,
  contributionId,
  updateExpenditure,
  postExpenditureComment,
  updateContribution,
  postContributionComment,
  contribution = true, // KELLY - need to pass in - also need for campaigns & ?
}) => {
  const [messageText, setText] = React.useState('');
  function handleTextChange(event) {
    setText(event.target.value);
  }
  function updateContributionOrExpenditure(messageText) {
    contribution
      ? [
          updateContribution({
            messageText,
          }),
          postContributionComment(id, messageText),
        ]
      : [
          updateExpenditure({
            messageText,
          }),
          postExpenditureComment(id, messageText),
        ];
  }
  return (
    <>
      <div css={messageBoxStyles.timelineGroup}>
        <h2 css={messageBoxStyles.reply}>Reply</h2>
        <div css={messageBoxStyles.timeline} />
      </div>
      <div css={messageBoxStyles.boxAndButton}>
        <TextareaAutosize
          css={messageBoxStyles.messageBox}
          rows="20"
          id="message"
          name="messageBox"
          label="Message"
          value={messageText}
          onChange={handleTextChange}
        >
          {/* <span css={messageBoxStyles.message}>Message to Campaign</span> */}
          {/* <p>{comment}</p> */}
        </TextareaAutosize>
        <Link
          to="#"
          css={messageBoxStyles.sendToCampaignButton}
          onClick={() => {
            updateContributionOrExpenditure(messageText);
          }}
        >
          Submit Message to Campaign
        </Link>
      </div>
    </>
  );
};

export default connect(
  state => ({}),
  dispatch => {
    return {
      updateContribution: data => dispatch(updateContribution(data)),
      updateExpenditure: data => dispatch(updateExpenditure(data)),
      postContributionComment: (id = 1001, message) =>
        dispatch(postContributionComment(id, message)),
      postExpenditureComment: (id, message) =>
        dispatch(postExpenditureComment(id, message)),
    };
  }
)(MessageBox);
