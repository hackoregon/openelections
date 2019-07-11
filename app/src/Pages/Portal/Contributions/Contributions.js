import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
// import AddContribution from "./AddContribution/AddContribution";
import ContributionReady from "../../../components/Forms/ContributionReady";
// import ContributionSubmitted from "./ContributionSubmitted/ContributionSubmitted";

// Switch statement for routing

const ContributionsPage = props => {
  return (
    <PageHoc>
      {/* <AddContribution /> */}
      <ContributionReady />
      {/* <ContributionSubmitted /> */}
    </PageHoc>
  );
};
export default ContributionsPage;
