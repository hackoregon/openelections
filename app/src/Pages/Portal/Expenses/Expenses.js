import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
// import AddExpense from "./Add/AddExpense";
import ExpensesDetail from "./Add/ExpensesDetail";

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
