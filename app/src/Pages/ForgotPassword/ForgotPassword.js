import React, { Component } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Paper from "@material-ui/core/Paper";
import PageHoc from "../../components/PageHoc/PageHoc";
import GreenCheck from "../../assets/icons/green-check";
import { ForgotPasswordForm } from "../../components/Forms/ForgotPassword";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const validationSchema = Yup.object({
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required")
});

const styles = css`
  max-width: 350px;
  .paper {
    margin-top: 30px,
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 40px;
  }
  .form-title {
    font-size: 35px;
    letter-spacing: -2px;
    margin: 10px 0px;
  }
`;

class ForgotPassword extends Component {
  state = {
    formValues: {
      email: ""
    },
    isSubmitted: false
  };

  handleStateChange(name, event) {
    console.log("change", name);
    this.setState({
      formValues: {
        ...this.state.formValues,
        [name]: event.target.value
      }
    });
  }
  formIsSubmitted(bool) {
    this.setState({ isSubmitted: bool });
  }
  clearState(e) {
    // e.preventDefault();
    console.log("clearing state");
    this.setState({
      formValues: {
        email: ""
      }
    });
  }
  render() {
    return (
      <PageHoc>
        <div css={styles}>
          <Paper elevation={1} className="paper">
            <p className="form-title">Forgot Password</p>
            {!this.state.isSubmitted ? (
              <Formik
                onSubmit={(values, actions) => {
                  console.log("Submitting: ", values, actions);
                  this.formIsSubmitted(true);
                }}
                onReset={(values, bag) => {
                  console.log("on reset", { values }, { bag });
                  this.clearState();
                  bag.resetForm(this.state.formValues);
                }}
                render={props => (
                  <ForgotPasswordForm
                    handleStateChange={this.handleStateChange.bind(this)}
                    clearState={this.clearState.bind(this)}
                    {...props}
                  />
                )}
                initialValues={this.state.formValues}
                validationSchema={validationSchema}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <GreenCheck width={80} />
                <p style={{ textAlign: "center" }}>
                  An email was sent to {this.state.formValues.email} to reset
                  your password.
                </p>
                <button
                  onClick={() => {
                    this.formIsSubmitted(false);
                    this.clearState();
                  }}
                >
                  close
                </button>
              </div>
            )}
          </Paper>
        </div>
      </PageHoc>
    );
  }
}
export default ForgotPassword;
