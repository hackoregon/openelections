import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ExpensesDetailForm from '../../../../components/Forms/ExpensesDetail/index';
import { login } from '../../../../state/ducks/auth';

const ExpensesDetail = ({ ...props }) => (
  <PageHoc>
    <ExpensesDetailForm {...props} />
  </PageHoc>
);

export default connect(
  state => {
    return { state: state.auth };
  },
  dispatch => {
    return {
      login: (email, password) => dispatch(login(email, password)),
      dispatch,
    };
  }
)(ExpensesDetail);
