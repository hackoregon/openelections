import React, { Component } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Paper from "@material-ui/core/Paper";
import PageHoc from "../../components/PageHoc/PageHoc";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { UpdateForgottenPasswordForm } from "../../components/Forms/UpdateForgottenPassword";
import GreenCheck from "../../assets/icons/green-check";

const validationSchema = Yup.object({
  newPassword: Yup.string("Choose a new password")
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmNewPassword: Yup.string(
    "Choose a new password that matches the other one"
  )
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Password confirmation is required")
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
  
  .user-signedup p {
  	margin: 50px 0;
  }
  
  .checkMark {
  	position: absolute;
  	transform: translate(10px, -4px);
  }
  .campaignName {
  	font-size: 20px;
  }
  
  
`;

class UpdateForgottenPassword extends Component {
  state = {
    formValues: {
      newPassword: "",
      confirmNewPassword: ""
    },
    isSubmitted: false
  };

  handleStateChange(name, event) {
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
        newPassword: "",
        confirmNewPassword: ""
      }
    });
  }
  render() {
    return (
      <PageHoc>
        <div css={styles}>
          <Paper elevation={1} className="paper">
            <p className="form-title">Update Forgotten Password</p>

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
                  <UpdateForgottenPasswordForm
                    handleStateChange={this.handleStateChange.bind(this)}
                    clearState={this.clearState.bind(this)}
                    {...props}
                  />
                )}
                initialValues={this.state.formValues}
                validationSchema={validationSchema}
              />
            ) : (
              <div className={"user-signedup"}>
                <p>
                  Your password is updated.
                  <span>
                    {" "}
                    s.helen@example.com{" "}
                    <GreenCheck width={30} className={"checkMark"} />{" "}
                  </span>
                </p>
              </div>
            )}
          </Paper>
        </div>
      </PageHoc>
    );
  }
}
export default UpdateForgottenPassword;
