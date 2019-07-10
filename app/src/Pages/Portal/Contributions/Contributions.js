import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
// import AddContribution from "./Add/AddContribution";
import ContributionSubmitted from "./Add/ContributionSubmitted";

// Switch statement for routing

const ContributionsPage = props => {
  return (
    <PageHoc>
      {/* <AddContribution /> */}
      <ContributionSubmitted />
    </PageHoc>
  );
};
export default ContributionsPage;
