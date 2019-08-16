import React from "react";
import AddContributionForm from "./AddContributionForm";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { connect } from "react-redux";
import { createContribution } from "../../../state/ducks/contributions"
import {
  ContributionTypeFieldEnum,
  ContributionStatusEnum,
  mapContributionFormToData,
  ContributionSubTypeFieldEnum,
  ContributorTypeFieldEnum
} from '../../../api/api';
import {
  AddHeaderSection,
  BasicsSection,
  ContributorSection,
  OtherDetailsSection
} from '../../../Pages/Portal/Contributions/Utils/ContributionsSections';
import {
    contributionsEmptyState
} from '../../../Pages/Portal/Contributions/Utils/ContributionsFields';

const onSubmit = (data, props) => {
  const { currentUserId, governmentId, campaignId, createContribution } = props
  const contributionData = mapContributionFormToData(data)
  const payload = {
    status: ContributionStatusEnum.DRAFT,
    governmentId,
    campaignId,
    currentUserId,
    ...contributionData
  }
  createContribution(payload).then(data => props.history.push(`/contributions/${data}`))
}

const AddContribution = ({ ...props }) => (
  <AddContributionForm
    onSubmit={data => onSubmit(data, props)}
    initialValues={contributionsEmptyState}
  >
    {({ formFields, isValid, handleSubmit, values }) => {
      const checkSelected = values.paymentMethod === "Check"
      if( values.submitForMatch != "No"){
        if( //Set submitForMatch to No under these conditions
          values.amountOfContribution > 500 ||
          values.typeOfContribution != ContributionTypeFieldEnum.CONTRIBUTION ||
          values.subTypeOfContribution != ContributionSubTypeFieldEnum.CASH_CONTRIBUTION ||
          (values.typeOfContributor != ContributorTypeFieldEnum.CANDIDATE_IMMEDIATE_FAMILY && values.typeOfContributor != ContributorTypeFieldEnum.INDIVIDUAL)
        ) {
            values['submitForMatch'] = 'No'
          }
      }
      // // Only show Employer section if the contributor type is Individual OR Family
      const showEmployerSection = (values.typeOfContributor == "Individual") || (values.typeOfContributor == "Candidate’s Immediate Family");
        console.log({showEmployerSection})

      return (
        <>
          <AddHeaderSection isValid={isValid} handleSubmit={handleSubmit} />
          <BasicsSection formFields={formFields} checkSelected={checkSelected} />
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
