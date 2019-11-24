/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { jsx } from '@emotion/core';
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
  const [attachment, setAttachment] = React.useState('');
  function handleTextChange(event) {
    event.preventDefault();
    setText(event.target.value);
  }
  function handleAttachmentChange(event) {
    event.preventDefault();
    setAttachment(event.target.files[0]);
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
        <input
          type="file"
          name="attachment"
          onChange={handleAttachmentChange}
        />
        <div css={messageBoxStyles.buttonWrapper}>
          <Button
            buttonType="submit"
            onClick={() => {
              postComment(id, messageText, attachment);
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
  null,
  dispatch => {
    return {
      postContributionComment: (id, message, attachment) =>
        dispatch(postContributionComment(id, message, attachment)),
      postExpenditureComment: (id, message, attachment) =>
        dispatch(postExpenditureComment(id, message, attachment)),
    };
  }
)(MessageBox);

MessageBox.propTypes = {
  expenditureId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  contributionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  postContributionComment: PropTypes.func,
  postExpenditureComment: PropTypes.func,
};
