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
  EmployerSection,
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
      if( values.typeOfContributor == "Individual" || values.typeOfContributor == "Candidate’s Immediate Family") {
        console.log("show employer section")
      } else {
        console.log("DON'T show employer section")
      }
      // If the self-employed option is selected OR If the occupation letter date (currently commented out) is filled in, 
      // then the employer name, city, state and zip code are not required
      if( values.occupation == "Self Employed" || values.occupationLetterDate !== ""){
        console.log('self employed is selected or occupation letter date is NOT empty, so employer info NOT required', {values})
      } else {
        console.log('self employed is NOT selected or occupation letter field is empty', {values})
      }
      return (
        <>
          <AddHeaderSection isValid={isValid} handleSubmit={handleSubmit} />
          <BasicsSection formFields={formFields} checkSelected={checkSelected} />
          <ContributorSection formFields={formFields} />
          <EmployerSection formFields={formFields} />
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
