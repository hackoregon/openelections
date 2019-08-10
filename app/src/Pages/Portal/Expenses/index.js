import React from "react";
import Expenses from './Expenses';

class ExpensesPage extends React.Component {

  render() {
    return <Expenses {...this.props} />
  }
}
export default ExpensesPage;