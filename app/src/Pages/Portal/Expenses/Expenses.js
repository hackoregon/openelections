import * as React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import AddExpense from './AddExpense/AddExpense';
import ExpensesDetail from './ExpensesDetail/ExpensesDetail';
import ExpensesTable from './ExpensesTable/ExpensesTable';

const Expenses = props => {
  const { match } = props;
  return (
    <Route
      render={({ location }) => {
        return (
          <Switch location={location}>
            <Route exact path={`${match.url}/new`} component={AddExpense} />
            <Route exact path={`${match.url}/:id`} component={ExpensesDetail} />
            <Route exact path={`${match.url}/`} component={ExpensesTable} />
          </Switch>
        );
      }}
    />
  );
};
export default Expenses;

Expenses.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]),
};
