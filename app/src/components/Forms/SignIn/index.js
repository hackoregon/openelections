import React from "react";
import FormModal from "../../FormModal/FormModal";
import Button from "../../Button/Button";
import SignInForm from "./SignInForm";
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

const SignIn = () => (
  <FormModal>
    <SignInForm
      onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
      initialValues={{
        email: "",
        password: ""
      }}
    >
      {({
        formSections,
        isValid,
        handleCancel,
        handleSubmit /* isDirty, isSubmitting */
      }) => (
        <React.Fragment>
          <p css={formTitle}>Sign In</p>
          <p>
              Enter your credentials to sign into the portal.
          </p>
          {formSections.signIn}
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
    </SignInForm>
  </FormModal>
);

export default SignIn;
