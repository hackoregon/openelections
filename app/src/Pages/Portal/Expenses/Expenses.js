import * as React from "react";
import { Route, Switch } from "react-router-dom";
//import PageHoc from "../../../components/PageHoc/PageHoc";
import AddExpense from "./AddExpense/AddExpense";
import ExpensesDetail from "./ExpensesDetail/ExpensesDetail";
import ExpensesTable from "./ExpensesTable";

// Switch statement for routing

const Expense = props => {
  const { match } = props
  return (
    <Route 
      render={({ location }) => {
        return (
        <Switch location={location}>
          <Route 
            exact 
            path="/expenses"
            component={ExpensesTable} 
          />          
          <Route 
            exact 
            path={`${match.url}/add`}
            component={AddExpense}
          />
          <Route 
            exact 
            path={`${match.url}/:id`}
            component={ExpensesDetail}
          />

        </Switch>
      )}}
    />
  );
};
export default Expense;