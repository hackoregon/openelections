import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
// import AddExpense from "./AddExpense/AddExpense";
import ExpensesDetail from "./ExpensesDetail/ExpensesDetail";

// Switch statement for routing

const ExpensePage = props => {
  return (
    <PageHoc>
      {/* <AddExpense /> */}
      <ExpensesDetail />
    </PageHoc>
  );
};
export default ExpensePage;
