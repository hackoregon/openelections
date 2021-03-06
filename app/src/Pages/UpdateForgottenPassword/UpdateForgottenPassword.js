/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-access-state-in-setstate */
// TODO Refactor using Form.js. Remove eslint-disable above.
import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Paper from '@material-ui/core/Paper';
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { flashMessage } from 'redux-flash';
import PageHoc from '../../components/PageHoc/PageHoc';
/** @jsx jsx */
import { UpdateForgottenPasswordForm } from '../../components/Forms/UpdateForgottenPassword';
import GreenCheck from '../../assets/icons/green-check';
import { resetPassword } from '../../state/ducks/auth';

// TODO Refactor to current page/form format

const validationSchema = Yup.object({
  newPassword: Yup.string('Choose a new password')
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmNewPassword: Yup.string(
    'Choose a new password that matches the other one'
  )
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Password confirmation is required'),
});

const styles = css`
  max-width: 350px;
  margin: 40px auto;
  
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
    text-align: center;
  }
  
  .user-signedup {
    display: flex;
    justify-content: center;
  }
  
  .user-signedup p {
    margin: 50px 0;
    text-align: center;
  }
  
  .checkMark {
  	position: absolute;
    transform: translate(10px, -4px);
    margin: 0
  }
  .campaignName {
  	font-size: 20px;
  }
  
  
`;

class UpdateForgottenPassword extends Component {
  state = {
    formValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    isSubmitted: false,
    updateCode: '',
  };

  componentDidMount() {
    const search = new URLSearchParams(this.props.location.search);
    const update_code = search.get('invitationCode');
    if (update_code) {
      this.setState({ updateCode: update_code });
    }
  }

  handleStateChange(name, event) {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [name]: event.target.value,
      },
    });
  }

  formIsSubmitted(bool) {
    this.setState({ isSubmitted: bool });
  }

  clearState() {
    this.setState({
      formValues: {
        newPassword: '',
        confirmNewPassword: '',
      },
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
                  this.props
                    .dispatch(
                      resetPassword(this.state.updateCode, values.newPassword)
                    )
                    .then(submitted => {
                      if (submitted) {
                        this.formIsSubmitted(true);
                        this.props.dispatch(
                          flashMessage('Password updated', {
                            props: { variant: 'success' },
                          })
                        );
                      } else {
                        this.props.dispatch(
                          flashMessage('Invalid code', {
                            props: { variant: 'error' },
                          })
                        );
                      }
                    });
                }}
                onReset={(values, bag) => {
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
              <div className="user-signedup">
                <GreenCheck width={50} className="checkMark" />
                <p>
                  Your password is updated.
                  <span />
                </p>
              </div>
            )}
          </Paper>
        </div>
      </PageHoc>
    );
  }
}
export default connect()(UpdateForgottenPassword);
