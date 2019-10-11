import React from 'react';
import { connect } from 'react-redux';
import { jsx } from '@emotion/core';
/** @jsx jsx */
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '../../Button/Button';
import { postExpenditureComment } from '../../../state/ducks/expenditures';
import { postContributionComment } from '../../../state/ducks/contributions';
import { messageBoxStyles } from '../../../assets/styles/forms.styles';

const MessageBox = ({
  contributionId,
  expenditureId,
  postContributionComment,
  postExpenditureComment,
}) => {
  const id = contributionId || expenditureId;
  const postComment = contributionId
    ? postContributionComment
    : postExpenditureComment;
  const [messageText, setText] = React.useState('');
  function handleTextChange(event) {
    event.preventDefault();
    setText(event.target.value);
  }
  function clearOnSubmit() {
    setText('');
  }
  return (
    <>
      <div css={messageBoxStyles.timelineGroup}>
        <h2 css={messageBoxStyles.reply}>Reply</h2>
        <div css={messageBoxStyles.timeline} />
      </div>
      <div css={messageBoxStyles.boxAndButton} style={{ marginRight: '0px' }}>
        <TextareaAutosize
          css={messageBoxStyles.messageBox}
          rows="3"
          id="message"
          name="messageBox"
          label="Message"
          style={{ fontSize: '21px' }}
          value={messageText}
          onChange={handleTextChange}
        >
          {/* <span css={messageBoxStyles.message}>Message to Campaign</span> */}
        </TextareaAutosize>
        <div css={messageBoxStyles.buttonWrapper}>
          <Button
            buttonType="submit"
            onClick={() => {
              postComment(id, messageText);
              clearOnSubmit();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default connect(
  state => ({}),
  dispatch => {
    return {
      postContributionComment: (id, message) =>
        dispatch(postContributionComment(id, message)),
      postExpenditureComment: (id, message) =>
        dispatch(postExpenditureComment(id, message)),
    };
  }
)(MessageBox);
