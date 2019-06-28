import React from "react";
import FormModal from "../../FormModal/FormModal";
import Button from "../../Button/Button";
import ResetPasswordForm from "./ResetPasswordForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { NavLink } from "react-router-dom";

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margin-top: 30px;
`;


const ResetPassword = () => (
  <FormModal>
    <ResetPasswordForm
      onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
      initialValues={{
        oldPassword: "",
        newPassword: ""
      }}
    >
      {({
        formSections,
        isValid,
        handleCancel,
        handleSubmit /* isDirty, isSubmitting */
      }) => (
        <React.Fragment>
          <p css={formTitle}>Reset Password</p>
          <p>
              Enter a strong password.
          </p>
          {formSections.resetPassword}
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
    </ResetPasswordForm>
  </FormModal>
);

export default ResetPassword;
