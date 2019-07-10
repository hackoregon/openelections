import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import AddExpense from "./Add/AddExpense";

// Switch statement for routing

const ExpensePage = props => {
  return (
    <PageHoc>
      <AddExpense />
    </PageHoc>
  );
};
export default ExpensePage;
