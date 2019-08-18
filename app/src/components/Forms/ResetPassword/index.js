import React from 'react';
import { css, jsx } from '@emotion/core';
import { NavLink } from 'react-router-dom';
import FormModal from '../../FormModal/FormModal';
import Button from '../../Button/Button';
import ResetPasswordForm from './ResetPasswordForm';
/** @jsx jsx */

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margin-top: 30px;
`;
const modalStyle = css`
  position: absolute;
  width: 350px;
  background: white;
  top: 8vh;
  left: calc(50vw - 175px);
`;

const ResetPassword = props => (
  <div css={modalStyle}>
    <FormModal>
      <ResetPasswordForm
        onSubmit={values => {
          props
            .updatePassword(values.oldPassword, values.newPassword)
            .then(props.submitted(true));
        }}
        initialValues={{
          oldPassword: '',
          newPassword: '',
        }}
      >
        {({
          formSections,
          isValid,
          handleCancel,
          handleSubmit /* isDirty, isSubmitting */,
        }) => (
          <React.Fragment>
            <p css={formTitle}>Reset Password</p>
            <p>Enter a strong password.</p>
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
  </div>
);

export default ResetPassword;
