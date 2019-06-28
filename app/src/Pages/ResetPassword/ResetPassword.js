import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import ResetPasswordForm from "../../components/Forms/ResetPassword/index";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

class ResetPassword extends Component {
  render() {
    return (
      <PageHoc>
        <ResetPasswordForm />
      </PageHoc>
    );
  }
}
export default ResetPassword;
