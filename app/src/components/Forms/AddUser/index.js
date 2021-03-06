import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
import FormModal from '../../FormModal/FormModal';
import Button from '../../Button/Button';
import AddUserForm from './AddUserForm';
import { clearModal } from '../../../state/ducks/modal';
import { inviteUser } from '../../../state/ducks/users';
import { isGovAdmin } from '../../../state/ducks/auth';
import { UserRoleEnum } from '../../../api/api';
/** @jsx jsx */

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margin-top: 30px;
`;
const leftAlign = css`
  align-self: flex-start;
`;

const USER_ROLES = {
  Admin: UserRoleEnum.CAMPAIGN_ADMIN,
  Staff: UserRoleEnum.CAMPAIGN_STAFF,
};
const AddUser = props => (
  <FormModal>
    <AddUserForm
      onSubmit={({ email, firstName, lastName, userRole }) => {
        const role = props.isGovAdmin ? false : USER_ROLES[userRole];
        props.inviteUser(email, firstName, lastName, props.orgId, role);
        props.clearModal();
      }}
      initialValues={{
        userRole: 'Staff',
        email: '',
        firstName: '',
        lastName: '',
      }}
    >
      {({
        formSections,
        isValid,
        handleCancel,
        handleSubmit /* isDirty, isSubmitting */,
      }) => (
        <React.Fragment>
          <p css={formTitle}>Add a New User</p>
          <div css={leftAlign}>
            {props.isGovAdmin || formSections.addUserRole}
          </div>
          <p>
            Enter the user&apos;s information and we will send them an email
            with instructions to join your portal.
          </p>
          {formSections.addUser}
          <div css={buttonWrapper}>
            <Button
              buttonType="cancel"
              onClick={() => {
                handleCancel();
                props.clearModal();
              }}
            >
              Cancel
            </Button>
            <Button
              buttonType="submit"
              disabled={!isValid}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </React.Fragment>
      )}
    </AddUserForm>
  </FormModal>
);

// export default AddUser;
export default connect(
  state => ({
    isGovAdmin: isGovAdmin(state),
    orgId:
      state.campaigns.currentCampaignId ||
      state.governments.currentGovernmentId,
  }),
  dispatch => {
    return {
      clearModal: () => dispatch(clearModal()),
      inviteUser: (email, firstName, lastName, campaignOrGovernmentId, role) =>
        dispatch(
          inviteUser(email, firstName, lastName, campaignOrGovernmentId, role)
        ),
    };
  }
)(AddUser);

AddUser.propTypes = {
  inviteUser: PropTypes.func,
  clearModal: PropTypes.func,
  orgId: PropTypes.number,
  isGovAdmin: PropTypes.bool,
};
