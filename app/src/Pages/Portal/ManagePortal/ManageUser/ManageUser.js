import * as React from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { flashMessage } from 'redux-flash';
import { css, jsx } from '@emotion/core';
import Button from '../../../../components/Button/Button';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import { resendUserInvite, removeUser } from '../../../../state/ducks/users';
import { showModal } from '../../../../state/ducks/modal';

/** @jsx jsx */

const finePrint = css`
  color: #333;
  font-size: 0.8em;
`;

const divSpacer = css`
  margin-top: 60px;
`;

const ManageUserPage = props => {
  const { id, email, userStatus } = props.location.state;

  const handleReSendEmail = () => {
    props.resendUserInvite(id);
    props.flashMessage('Email Resent', { props: { variant: 'success' } });
  };

  return (
    <PageHoc>
      <h1>
        <IconButton
          aria-label="Back"
          onClick={() => props.history.push('/manage-portal')}
        >
          <ArrowBack style={{ fontSize: '36px', color: 'black' }} />
        </IconButton>
        Manage User
      </h1>
      <div className="manage-user-container">
        <div className="manage-user-intro">
          <h1>User Name</h1>
          <p>{email}</p>
          {userStatus === 'invited' && (
            <React.Fragment>
              <p className="fine-print" css={finePrint}>
                This user hasn't finished creating their account.
              </p>
              <Button buttonType="primary" onClick={() => handleReSendEmail()}>
                Resend Invitation
              </Button>
            </React.Fragment>
          )}
        </div>
        <div className="manage-user-role" css={divSpacer}>
          <h2>Manage Role</h2>
        </div>
        <div className="remove-user">
          <Button
            buttonType="remove"
            onClick={() =>
              props.dispatch(showModal({ component: 'RemoveUser', props }))
            }
          >
            Remove User
          </Button>
        </div>
      </div>
    </PageHoc>
  );
};

export default connect(
  state => ({}),
  dispatch => {
    return {
      resendUserInvite: id => dispatch(resendUserInvite(id)),
      removeUser: (userId, permissionId) =>
        dispatch(removeUser(userId, permissionId)),
      flashMessage: (message, options) =>
        dispatch(flashMessage(message, options)),
      dispatch,
    };
  }
)(ManageUserPage);
