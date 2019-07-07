import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import AddContribution from "../../AddContribution/AddContribution"

const ContributionsPage = props => {
  return (
  <PageHoc>       {/* KELLY - will need switch routing depending on form */} 
      <AddContribution />
    </PageHoc>
  );
};
export default ContributionsPage;
