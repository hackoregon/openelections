import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
// import AddContribution from "./AddContribution/AddContribution";
// import ContributionReady from "../../../components/Forms/ContributionReady";
// import ContributionSubmitted from "./ContributionSubmitted/ContributionSubmitted";
import ContributionNeedsReview from "../../../components/Forms/CityViews/ContributionNeedsReview";

// Switch statement for routing

const ContributionsPage = props => {
  return (
    <PageHoc>
      {/* CAMPAIGN PAGES */}
      {/* <AddContribution /> */}
      {/* <ContributionReady /> */}
      {/* <ContributionSubmitted /> */}

      {/* CITY PAGES */}
      <ContributionNeedsReview />
    </PageHoc>
  );
};
export default ContributionsPage;
