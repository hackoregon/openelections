import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import SignInForm from "../../components/Forms/SignIn/index";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

class SignIn extends Component {
  render() {
    return (
      <PageHoc>
        <SignInForm />
      </PageHoc>
    );
  }
}
export default SignIn;
