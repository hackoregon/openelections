import React from 'react';
import { css, jsx } from '@emotion/core';
import FormModal from '../../FormModal/FormModal';
import SignUpForm from './SignUpForm';
import Button from '../../Button/Button';
/** @jsx jsx */

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margintop: 30px;
`;

const modalStyle = css`
  position: absolute;
  width: 350px;
  background: white;
  top: 8vh;
  left: calc(50vw - 175px);
`;

const SignUp = ({ code, redeemInvite }) => (
  <div css={modalStyle}>
    <FormModal>
      <SignUpForm
        onSubmit={values => redeemInvite(code, values.newPassword)}
        initialValues={{
          newPassword: '',
          confirmNewPassword: '',
        }}
      >
        {({
          formSections,
          isValid,
          handleSubmit /* isDirty, isSubmitting */,
        }) => (
          <React.Fragment>
            <p css={formTitle}>Sign Up</p>
            <p>Create a strong password to complete the sign up process</p>
            {formSections.newPassword}
            {formSections.confirmNewPassword}
            <div css={buttonWrapper}>
              <br />
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
      </SignUpForm>
    </FormModal>
  </div>
);

export default SignUp;
