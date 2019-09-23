import React from 'react';
import { withRouter } from 'react-router-dom';
import Expenses from './Expenses';

class ExpensesPage extends React.Component {
  render() {
    const { history, match } = this.props;
    return <Expenses history={history} match={match} />;
  }
}
export default withRouter(ExpensesPage);
