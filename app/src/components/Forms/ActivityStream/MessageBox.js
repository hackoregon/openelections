import React from 'react';
import { connect } from 'react-redux';
import { jsx } from '@emotion/core';
/** @jsx jsx */
import { Link } from 'react-router-dom';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { postExpenditureComment } from '../../../state/ducks/expenditures';
import { postContributionComment } from '../../../state/ducks/contributions';
import { messageBoxStyles } from '../../../assets/styles/forms.styles';

const MessageBox = ({
  contributionId,
  postExpenditureComment,
  postContributionComment,
  contribution = true, // KELLY - need to pass in - also need for campaigns & ?
}) => {
  const [messageText, setText] = React.useState('');
  function handleTextChange(event) {
    setText(event.target.value);
  }
  function clearOnSubmit() {
    setText('');
  }
  function updateContributionOrExpenditure(messageText) {
    contribution
      ? postContributionComment(contributionId, messageText)
      : postExpenditureComment(contributionId, messageText);
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
        </TextareaAutosize>
        <Link
          to="#"
          css={messageBoxStyles.sendToCampaignButton}
          onClick={() => {
            updateContributionOrExpenditure(messageText);
            clearOnSubmit(messageText);
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
      postContributionComment: (contributionId, message) =>
        dispatch(postContributionComment(contributionId, message)),
      postExpenditureComment: (contributionId, message) =>
        dispatch(postExpenditureComment(contributionId, message)),
    };
  }
)(MessageBox);
