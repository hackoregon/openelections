import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import PageHoc from "../../components/PageHoc/PageHoc";
import { ChangePasswordForm } from "../../components/Forms/ChangePassword";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const formModalWrapper = css`
  max-width: 350px;
`;
const paper = css`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 40px;
`;
const formTitle = css`
  font-size: 35px;
  letter-spacing: -2px;
  margin: 10px 0px;
`;

class ChangePassword extends Component {
  render() {
    return (
      <PageHoc>
        <ChangePasswordForm
          onSubmit={x => console.log("REPLACE ME WITH SOMETHING REAL!")}
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
          }}
        >
          {({ form, isDirty, isSubmitting }) => (
            <div css={formModalWrapper}>
              <Paper elevation={1} css={paper}>
                <p css={formTitle}>Change Password</p>
                {form}
              </Paper>
            </div>
          )}
        </ChangePasswordForm>
      </PageHoc>
    );
  }
}
export default ChangePassword;
