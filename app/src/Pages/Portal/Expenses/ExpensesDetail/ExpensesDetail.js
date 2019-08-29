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

class AddExpense extends Component {
  componentDidMount() {
    const { getExpenditureById, expenditureId } = this.props;
    getExpenditureById(parseInt(expenditureId));
  }

  render() {
    const {
      expenditures,
      expenditureId,
      history,
      currentExpenditure,
    } = this.props;
    const data = expendituresEmptyState;
    if (currentExpenditure) {
      data - mapExpenditureDataToForm(currentExpenditure);
    }
    return (
      <PageHoc>
        <ExpensesDetailForm
          data={data}
          expenditureId={expenditureId}
          history={history}
        />
      </PageHoc>
    );
  }
}
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
)(AddExpense);
