import React from "react";
import AddContributionForm from "./AddContributionForm";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { connect } from "react-redux";
import { createContribution } from "../../../state/ducks/contributions"
import {
    ContributionStatusEnum,
    ContributionTypeEnum,
    ContributionSubTypeEnum,
    ContributorTypeEnum,
    ContactTypeFieldEnum,
    ContributorTypeFieldToDataMap,
    ContributionSubTypeFieldToDataMap,
    ContributionTypeFieldToDataMap
} from '../../../api/api';
import {
    AddHeaderSection,
    BasicsSection,
    ContributorSection,
    OtherDetailsSection
} from '../../../Pages/Portal/Contributions/Utils/ContributionsSections';

const onSubmit = (data, props) => {
  const { currentUserId, governmentId, campaignId, createContribution } = props
  const {
    streetAddress,
    amountOfContribution,
    city,
    dateOfContribution,
    addressLine2,
    firstName,
    lastNameOrEntity,
    state,
    zipcode,
    employerName,
    employerCity,
    employerState,
    occupation,
    description,
    electionAggregate,
    contactInformation,
    contactType,
    checkNumber,
    typeOfContributor,
    subTypeOfContribution,
    typeOfContribution
  } = data
  
  // TODO: need to fix some of the fields here.
  createContribution({
    status: ContributionStatusEnum.DRAFT,
    governmentId,
    campaignId,
    city,
    currentUserId,
    firstName,
    state,
    occupation,
    employerName,
    employerCity,
    employerState,
    checkNumber,
    contributorType: ContributorTypeFieldToDataMap.get(typeOfContributor),
    subType: ContributionSubTypeFieldToDataMap.get(subTypeOfContribution),
    type: ContributionTypeFieldToDataMap.get(typeOfContribution),
    address1: streetAddress,
    address2: addressLine2,
    email: contactType === ContactTypeFieldEnum.EMAIL ? contactInformation : null,
    phone: contactType !== ContactTypeFieldEnum.EMAIL ? contactInformation : null,
    phoneType: contactType !== ContactTypeFieldEnum.EMAIL ? contactType : null,
    amount: parseFloat(amountOfContribution),
    date: new Date(dateOfContribution).getTime() / 1000,
    middleInitial: "",
    lastName: lastNameOrEntity,
    type: ContributionTypeEnum.CONTRIBUTION,
    subType: ContributionSubTypeEnum.CASH,
    zip: zipcode,
    contributorType: ContributorTypeEnum.INDIVIDUAL,
    inKindDescription: description, 
    calendarYearAggregate: electionAggregate,
  }).then(data => props.history.push(`/contributions/ready/${data}`))
}

const AddContribution = ({ ...props }) => (
  <AddContributionForm
    onSubmit={data => onSubmit(data, props)}
    initialValues={{
      // BASICS VALUES
      dateOfContribution: "",
      typeOfContribution: "",
      subTypeOfContribution: "",
      typeOfContributor: "",
      amountOfContribution: undefined,
      oaeContributionType: "",
      paymentMethod: "",
      checkNumber: undefined,

      // CONTRIBUTOR VALUES
      firstName: "",
      lastNameOrEntity: "",
      streetAddress: "",
      addressLine2: "",
      city: "Portland",
      state: "OR",
      zipcode: "97201",
      contactType: "",
      contactInformation: "",
      occupation: "",
      employerName: "",
      employerCity: "Portland",
      employerState: "OR",
      employerZipcode: "97201",

      // OTHER DETAILS VALUES
      electionAggregate: "",
      description: "",
      occupationLetterDate: "",
      linkToDocumentation: "",
      notes: ""
    }}
  >
    {({ formFields, isValid, handleSubmit }) => {
      return (
        <>
          <AddHeaderSection isValid={isValid} handleSubmit={handleSubmit} />
          <BasicsSection formFields={formFields} />
          <ContributorSection formFields={formFields} />
          <OtherDetailsSection formFields={formFields} />
        </>
      )
    }}
  </AddContributionForm>
);

export default connect(
  state => ({
    currentUserId: state.auth.me.id,
    governmentId: state.auth.me.permissions[0].id,
    campaignId: state.auth.me.permissions[0].campaignId
  }),
  dispatch => ({
    createContribution: (data) => dispatch(createContribution(data))
  })
)(AddContribution);
