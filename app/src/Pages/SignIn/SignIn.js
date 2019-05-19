import React, { Component } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Paper from "@material-ui/core/Paper";
import PageHoc from "../../components/PageHoc/PageHoc";
import { SignInForm } from "../../components/Forms/SignIn";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const validationSchema = Yup.object({
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string("What was you password").required(
    "What was your password"
  )
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

class SignIn extends Component {
  state = {
    formValues: {
      email: "",
      password: ""
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
        email: "",
        password: ""
      }
    });
  }
  render() {
    return (
      <PageHoc>
        <div css={styles}>
          <Paper elevation={1} className="paper">
            <p className="form-title">Sign In</p>
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
                <SignInForm
                  handleStateChange={this.handleStateChange.bind(this)}
                  clearState={this.clearState.bind(this)}
                  {...props}
                />
              )}
              initialValues={this.state.formValues}
              validationSchema={validationSchema}
            />
          </Paper>
        </div>
      </PageHoc>
    );
  }
}
export default SignIn;
