import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import AddExpenseForm from '../../../../components/Forms/AddExpense/index';

class AddExpense extends Component {
  render() {
    return (
      <PageHoc>
        <AddExpenseForm {...this.props} />
      </PageHoc>
    );
  }
}

export default connect()(AddExpense);
