import React from "react";
import FormModal from "../../FormModal/FormModal";
import Button from "../../Button/Button";
import AddContributionForm from "./AddContributionForm";
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

const AddContribution = () => (
  <FormModal>
    <AddContributionForm
      onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
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
          {formSections.addContribution} {/* !!!!!!!!!KELLY- fix!!!!!!! */ }
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
    </AddContributionForm>
  </FormModal>
);

export default AddContribution;
