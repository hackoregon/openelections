import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
// import AddExpense from "./AddExpense/AddExpense";
// import ExpensesDetail from "./ExpensesDetail/ExpensesDetail";
import ExpensesTable from "./ExpensesTable/ExpensesTable";

// Switch statement for routing

const Expense = props => {
  return (
    <PageHoc>
      {/* <AddExpense /> */}
      {/* <ExpensesDetail /> */}
      <ExpensesTable  {...props} />
    </PageHoc>
  );
};
export default Expense;