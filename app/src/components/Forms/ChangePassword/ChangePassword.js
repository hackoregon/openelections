import React from 'react';
import { css, jsx } from '@emotion/core';
import FormModal from '../../FormModal/FormModal';
import Button from '../../Button/Button';
import ChangePasswordForm from './ChangePasswordForm';
/** @jsx jsx */

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margintop: 30px;
`;

const ChangePassword = () => (
  <FormModal>
    <ChangePasswordForm
      onSubmit={x => console.log('REPLACE ME WITH SOMETHING REAL!')}
      initialValues={{
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }}
    >
      {({
        formSections,
        isValid,
        handleCancel,
        handleSubmit /* isDirty, isSubmitting */,
      }) => (
        <React.Fragment>
          <p css={formTitle}>Change Password</p>
          {formSections.oldPassword}
          {formSections.newPassword}
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
    </ChangePasswordForm>
  </FormModal>
);

export default ChangePassword;
