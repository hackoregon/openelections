import React from "react";
import { connect } from "react-redux";
import Expenses from './Expenses';
import { getExpenditures } from "../../../state/ducks/expenditures";

class ExpensesPage extends React.Component {
  componentDidMount() {
    // TODO: API requires government and campaign ID, is that available to campaign users?
    this.props.getExpenditures({ governmentId: 1 })
    console.log('hshshshsh');
  }

  render() {
    return <Expenses {...this.props} />
  }
}
export default connect(
  state => ({}),
  dispatch => ({ getExpenditures: (data) => dispatch(getExpenditures(data))})
)(ExpensesPage);