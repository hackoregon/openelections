import React from "react";
import FormModal from "../../FormModal/FormModal";
import Button from "../../Button/Button";
import SignInForm from "./SignInForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "react-router-dom";

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margin-top: 30px;
`;
const forgotLink = css`
  margin-top: 20px;
  align-self: flex-start;
`;

 const SignIn =(props)=> (

    <FormModal >
      <SignInForm 
      onSubmit={
      values => {
        props.login(values.email, values.password);
      }
    }
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
          <div css={forgotLink}>
          
              <Link to={'/forgot-password'}>Forgot Password</Link>
          </div>
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