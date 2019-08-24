import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddExpense from './AddExpense/AddExpense';
import ExpensesDetail from './ExpensesDetail/ExpensesDetail';
import ExpensesTable from './ExpensesTable/ExpensesTable';

// Switch statement for routing

const Expenses = props => {
  const { match } = props;
  return (
    <Route
      render={({ location }) => {
        return (
          <Switch location={location}>
            <Route exact path={`${match.url}/`} component={ExpensesTable} />
            <Route exact path={`${match.url}/new`} component={AddExpense} />
            <Route
              exact
              path={`${match.url}/details`}
              component={ExpensesDetail}
            />
          </Switch>
        );
      }}
    />
  );
};
export default Expenses;
