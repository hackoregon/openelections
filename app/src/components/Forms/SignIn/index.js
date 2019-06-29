import React from "react";
import FormModal from "../../FormModal/FormModal";
import Button from "../../Button/Button";
import SignInForm from "./SignInForm";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { NavLink } from "react-router-dom";
import {login } from "../../../state/ducks/auth";
//import { connect } from "react-redux";

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

class SignIn extends React.Component {
  render() {
    return (
    <FormModal >
      <SignInForm   
      onSubmit={
      values => this.props.dispatch(login(values.email, values.password))
      }
      initialValues={{
        email: "govadmin@openelectionsportland.org",
        password: "passwordd" 
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
              <NavLink to={'/forgotPassword'}>Forgot Password</NavLink>
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
  }
}

export default SignIn;