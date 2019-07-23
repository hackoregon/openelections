import React from "react";
import { connect } from "react-redux";
import FormModal from "../../FormModal/FormModal";
import Button from "../../Button/Button";
import AddCampaignForm from "./AddCampaignForm";
import { createCampaignForGovernment } from "../../../state/ducks/campaigns";
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

const USER_ROLES = {
  Admin: "campaign_admin",
  Staff: "campaign_staff"
};
// Todo: get from API

const AddCampaign = props => (
  <FormModal>
    <AddCampaignForm 
      onSubmit={({ name, email, firstName, lastName, governmentId=1,officeSought = 'mayor' }) => {
        props.createCampaignForGovernment(
            governmentId,
            name,
            officeSought,
            email, 
            firstName, 
            lastName  
        );
        props.clearModal();
      }}
      initialValues={{
        name: "",
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
          <p css={formTitle}>Add New Campaign</p>
          <div css={leftAlign}>{formSections.AddCampaignRole}</div>
          <p>
            Enter the user's information and we will send them an email with
            instructions to join your portal.
          </p>
          {formSections.AddCampaign}
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
    </AddCampaignForm>
  </FormModal>
);

// export default AddCampaign;
export default connect(
  state => ({}),
  dispatch => {
    return {
      createCampaignForGovernment: (
        governmentId,
        name,
        officeSought,
        email,
        firstName,
        lastName
        ) => dispatch(createCampaignForGovernment(
        governmentId,
        name,
        officeSought,
        email,
        firstName, 
        lastName
        )),
      clearModal: () => dispatch(clearModal())
    };
  }
)(AddCampaign);
