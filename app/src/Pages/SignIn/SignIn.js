import React, { Component } from "react";
import PageHoc from "../../components/PageHoc/PageHoc";
import SignInForm from "../../components/Forms/SignIn/index";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { connect } from "react-redux";

class SignIn extends Component {
  render() {
    return (
      <PageHoc>
        <SignInForm dispatch={this.props.dispatch}/>
      </PageHoc>
    );
  }
}

export default connect()(SignIn);
