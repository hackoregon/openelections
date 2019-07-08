import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import AddContribution from "./Add/AddContribution";

const ContributionsPage = props => {
  return (
    <PageHoc>
      <AddContribution />
    </PageHoc>
  );
};
export default ContributionsPage;
