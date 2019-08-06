import React from "react";
import ContributionReadyForm from "./ContributionReadyForm";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { connect } from "react-redux";
import { ReadyHeaderSection, BasicsSection, ContributorSection, OtherDetailsSection } from "../../../Pages/Portal/Contributions/Utils/ContributionsSections";
import { format } from "date-fns"
import {
    DataToContributionTypeFieldMap,
    DataToContributionSubTypeFieldMap,
    DataToContributorTypeFieldMap,
    // ContactTypeFieldEnum,
    // DataToContactTypeFieldMap
} from '../../../api/api';

const onSubmit = (data) => {
  console.log(data)
}

// TODO: need to get data for the following:
// - oaeContributionType
// - paymentMethod
// - employerZipcode
// - occupationLetterDate
// - linkToDocumentation
// - notes
const mapDataToForm = (contribution) => {
  const {
    date,
    // createdAt,
    type, 
    subtype,
    contributorType,
    amount, 
    checkNumber,
    firstName, 
    lastName, 
    address1,
    address2, 
    city, 
    state,
    zip,
    email,
    phone,
    // phoneType, 
    occupation,
    employerName,
    employerCity,
    employerState,
    calendarYearAggregate,
    inKindDescription,
  } = contribution
  return {
    // BASICS VALUES
    dateOfContribution: date ? format(new Date(date), "yyyy-MM-dd"): 0,
    typeOfContribution: DataToContributionTypeFieldMap.get(type),
    subTypeOfContribution: DataToContributionSubTypeFieldMap.get(subtype) || "",
    typeOfContributor: DataToContributorTypeFieldMap.get(contributorType),
    amountOfContribution: amount,
    checkNumber: checkNumber,

    // CONTRIBUTOR VALUES
    firstName,
    lastName,
    streetAddress: address1,
    addressLine2: address2,
    city,
    state,
    zipcode: zip,
    // TODO: contact type can return null for users
    // contactType: email ? ContactTypeFieldEnum.EMAIL : DataToContactTypeFieldMap.get(phoneType),
    contactType: "",
    contactInformation: email || phone,
    occupation: occupation || "",
    employerName,
    employerCity,
    employerState: employerState || "",

    // OTHER DETAILS VALUES
    electionAggregate: calendarYearAggregate,
    description: inKindDescription || "",
    oaeContributionType: "",
    paymentMethod: "", 
    
  }
}

const ContributionReady = ({ contribution }) => (
<>
  {contribution.date ?  
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
: <div></div>  }
</>
);
export default connect(
  state => ({
    currentUserId: state.auth.me.id,
    governmentId: state.auth.me.permissions[0].id,
    campaignId: state.auth.me.permissions[0].campaignId
  })
)(ContributionReady);
