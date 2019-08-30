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
    const attibutes = this.props.getGovOrCampIdAttributes;
    this.props.getExpenditures({ ...attibutes });
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
