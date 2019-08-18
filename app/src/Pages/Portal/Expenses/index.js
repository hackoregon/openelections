import React from 'react';
import { connect } from 'react-redux';
import Expenses from './Expenses';
import {
  getExpenditures,
  getExpendituresList,
} from '../../../state/ducks/expenditures';
import { getGovOrCampIdAttributes } from '../../../state/ducks/auth';

class ExpensesPage extends React.Component {
  componentDidMount() {
    if (this.props.expendituresList.length < 1) {
      // fetch data only if it's not in redux
      const attibutes = this.props.getGovOrCampIdAttributes; // Get list based on current role of user
      this.props.getExpenditures({ ...attibutes });
    }
  }

  render() {
    return <Expenses {...this.props} />;
  }
}
export default connect(
  state => ({
    isListLoading: state.expenditures.isLoading,
    expendituresList: getExpendituresList(state),
    getGovOrCampIdAttributes: getGovOrCampIdAttributes(state),
  }),
  dispatch => ({ getExpenditures: data => dispatch(getExpenditures(data)) })
)(ExpensesPage);
