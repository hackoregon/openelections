import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import AddContribution from "./Add/AddContribution"
import AddContributionHeader from "../../../components/Forms/AddContribution/Header";

const ContributionsPage = props => {
  return (
    <PageHoc>       {/* KELLY - will need switch routing depending on form */} 
      <AddContributionHeader/>
      <AddContribution />
    </PageHoc>
  );
};
export default ContributionsPage;
