import React from "react";
import { connect } from "react-redux";
import FormModal from "../../FormModal/FormModal";
import Button from "../../Button/Button";
import AddUserForm from "./AddUserForm";
import { inviteUser } from "../../../state/ducks/users";
import { clearModal } from "../../../state/ducks/modal";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

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

const AddUser = props => (
  <FormModal>
    <AddUserForm
      onSubmit={({ email, firstName, lastName, userRole }) => {
        //TODO: find gov id
        props.inviteUser(email, firstName, lastName, /*temp gov id */ 1, userRole);
        props.clearModal();
      }}
      initialValues={{
        userRole: "Staff",
        email: "",
        firstName: "",
        lastName: ""
      }}
    >
      {({
        formSections,
        isValid,
        handleCancel,
        handleSubmit /* isDirty, isSubmitting */
      }) => (
          <React.Fragment>
            <p css={formTitle}>Add a New User</p>
            <div css={leftAlign}>{formSections.addUserRole}</div>
            <p>
              Enter the user's information and we will send them an email with
              instructions to join your portal.
          </p>
            {formSections.addUser}
            <div css={buttonWrapper}>
              <Button buttonType="cancel" onClick={handleCancel}>
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
  state => ({}),
  dispatch => {
    return {
      inviteUser: (email, firstName, lastName, campaignOrGovernmentId, role) => dispatch(inviteUser(email, firstName, lastName, campaignOrGovernmentId, role)),
      clearModal: () => dispatch(clearModal())
    };
  }
)(AddUser);
