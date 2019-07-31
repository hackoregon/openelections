import React from "react";
import ContributionReadyForm from "./ContributionReadyForm";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { connect } from "react-redux";
import { ReadyHeaderSection, BasicsSection, ContributorSection, OtherDetailsSection } from "../../../Pages/Portal/Contributions/Utils/ContributionsSections";
import { contribution } from '../../../api/schema';

const onSubmit = (data) => {
  console.log(data)
}

// TODO: need to form data
const mapDataToForm = (contribution) => {
  console.log(contribution)
  return {
    // BASICS VALUES
    dateOfContribution: "09/09/2019", // Date.now(), // FORMAT?
    typeOfContribution: "Contribution",
    subTypeOfContribution: "In-Kind Contribution",
    typeOfContributor: "Individual",
    amountOfContribution: `$ ${100}`,
    oaeContributionType: "Matchable",
    paymentMethod: "Check",
    checkNumber: "#1027",

    // CONTRIBUTOR VALUES
    firstName: "Helen",
    lastName: "Troy",
    streetAddress: "2526 Race Street",
    addressLine2: "",
    city: "Portland",
    state: "OR",
    zipcode: "97212",
    contactType: "Email",
    contactInformation: "s.helen@example.com",
    occupation: "Program Manager",
    employerName: "Self Employed",
    employerCity: "Portland",
    employerState: "OR",
    employerZipcode: "97212",

    // OTHER DETAILS VALUES
    electionAggregate: "2019",
    description: "Some Description",
    occupationLetterDate: "",
    linkToDocumentation: "",
    notes: ""
  }
}

const ContributionReady = ({ contribution }) => (
  <ContributionReadyForm
    onSubmit={onSubmit}
    initialValues={mapDataToForm(contribution)}
  >
    {({ formFields, isValid, handleSubmit }) => (
      <>
        <ReadyHeaderSection isValid={isValid} handleSubmit={handleSubmit} />
        <BasicsSection formFields={formFields} />
        <ContributorSection formFields={formFields} />
        <OtherDetailsSection formFields={formFields} />
      </>
    )}
  </ContributionReadyForm>
);
export default connect(
  state => ({
    currentUserId: state.auth.me.id,
    governmentId: state.auth.me.permissions[0].id,
    campaignId: state.auth.me.permissions[0].campaignId
  })
)(ContributionReady);
