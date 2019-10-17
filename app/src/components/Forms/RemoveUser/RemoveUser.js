// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
import Button from '../../Button/Button';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import FormModal from '../../FormModal/FormModal';
/** @jsx jsx */

const removeUserStyle = css`
  word-break: break-word;
`;
const buttonContainer = css`
  display: flex;
  margin-top: 30px;
  button {
    margin: 10px;
  }
`;
const removeUserTitle = css`
  font-size: 36px;
`;

const RemoveUser = ({ location, removeUser, clearModal }) => {
  return (
    <FormModal>
      <div css={removeUserStyle}>
        <h1 css={removeUserTitle}>Remove User </h1>
        <p>{location.state.email} will no longer have access to the portal.</p>
        <p>Are you sure you want to remove them?</p>
        <div css={buttonContainer}>
          <Button buttonType="formDefaultOutlined" onClick={() => clearModal()}>
            Cancel
          </Button>
          <Button
            buttonType="formDefault"
            onClick={() => removeUser(location.state.id, location.state.roleId)}
          >
            Submit
          </Button>
        </div>
      </div>
    </FormModal>
  );
};
// export default RemoveUser;
export default connect(
  state => ({
    getModalState: getModalState(state),
  }),
  dispatch => {
    return {
      clearModal: () => dispatch(clearModal()),
    };
  }
)(RemoveUser);

RemoveUser.propTypes = {
  location: PropTypes.oneOfType([PropTypes.object]),
  removeUser: PropTypes.func,
  clearModal: PropTypes.func,
};
