import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ExpensesDetailForm from '../../../../components/Forms/ExpensesDetail/index';
import {
  getExpenditureById,
  getCurrentExpenditure,
} from '../../../../state/ducks/expenditures';
import {
  expendituresEmptyState,
  mapExpenditureDataToForm,
} from '../ExpendituresFields';

const ExpensesDetail = ({ ...props }) => (
  <PageHoc>
    <ExpensesDetailForm {...props} />
  </PageHoc>
);

export default connect(
  (state, ownProps) => ({
    expenditureId: parseInt(ownProps.match.params.id),
    expenditures: state.expenditures,
    history: ownProps.history,
    currentExpenditure: getCurrentExpenditure(state),
  }),
  dispatch => ({
    getExpenditureById: id => dispatch(getExpenditureById(id)),
  })
)(ExpensesDetail);
