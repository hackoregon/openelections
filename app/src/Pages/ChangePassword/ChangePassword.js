import React from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import FormModal from "../../components/FormModal/FormModal"
import ChangePasswordForm from "../../components/Forms/ChangePassword";
import Button from "../../components/Button/Button"
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;
const buttonWrapper = css`
  margintop: 30px;
`;

const ChangePassword = () => (
  <PageHoc>
    <FormModal>
      <ChangePasswordForm
        onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        }}
      >
        {({
          form,
          isValid,
          handleCancel,
          handleSubmit /* isDirty, isSubmitting */
        }) => (
          <React.Fragment>
            <p css={formTitle}>Change Password</p>
            {form}
            <div css={buttonWrapper}>
              <Button
                buttonType="cancel"
                onClick={handleCancel}
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
      </ChangePasswordForm>
    </FormModal>
  </PageHoc>
);

export default ChangePassword;
