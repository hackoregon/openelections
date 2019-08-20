import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import AddContributionForm from './AddContributionForm';
import { createContribution } from '../../../state/ducks/contributions';
import {
  ContributionTypeFieldEnum,
  ContributionStatusEnum,
  mapContributionFormToData,
  ContributionSubTypeFieldEnum,
  ContributorTypeFieldEnum,
} from '../../../api/api';
import {
  AddHeaderSection,
  BasicsSection,
  ContributorSection,
  OtherDetailsSection,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsSections';
import {
  contributionsEmptyState,
  inKindContributionValues,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsFields';

const onSubmit = (data, props) => {
  const { currentUserId, governmentId, campaignId, createContribution } = props;
  const contributionData = mapContributionFormToData(data);
  const payload = {
    status: ContributionStatusEnum.DRAFT,
    governmentId,
    campaignId,
    currentUserId,
    ...contributionData,
  };
  createContribution(payload).then(data =>
    props.history.push(`/contributions/${data}`)
  );
};

const AddContribution = ({ ...props }) => (
  <AddContributionForm
    onSubmit={data => onSubmit(data, props)}
    initialValues={contributionsEmptyState}
  >
    {({ formFields, isValid, handleSubmit, values }) => {
      const isPerson = !!(
        values.typeOfContributor === ContributorTypeFieldEnum.INDIVIDUAL ||
        values.typeOfContributor ===
          ContributorTypeFieldEnum.CANDIDATE_IMMEDIATE_FAMILY
      );
      const checkSelected =
        values.paymentMethod === 'Check' ||
        values.paymentMethod === 'Money Order';

      // Only show Employer section if the contributor type is Individual OR Family AND Occupation is 'Other'
      const showEmployerSection = values.occupation === 'Other' && isPerson;
      const showInKindFields = !!inKindContributionValues.includes(
        values.subTypeOfContribution
      );

      if (values.submitForMatch !== 'No') {
        if (
          // Set submitForMatch to No under these conditions
          values.amountOfContribution > 500 ||
          values.typeOfContribution !==
            ContributionTypeFieldEnum.CONTRIBUTION ||
          values.subTypeOfContribution !==
            ContributionSubTypeFieldEnum.CASH_CONTRIBUTION ||
          (values.typeOfContributor !==
            ContributorTypeFieldEnum.CANDIDATE_IMMEDIATE_FAMILY &&
            values.typeOfContributor !== ContributorTypeFieldEnum.INDIVIDUAL)
        ) {
          values.submitForMatch = 'No';
        }
      }

      return (
        <>
          <AddHeaderSection isValid={isValid} handleSubmit={handleSubmit} />
          <BasicsSection
            formFields={formFields}
            checkSelected={checkSelected}
            showInKindFields={showInKindFields}
          />
          <ContributorSection
            formFields={formFields}
            showEmployerSection={showEmployerSection}
            isPerson={isPerson}
          />
          {/* <EmployerSection formFields={formFields} /> */}
          {/* <OtherDetailsSection formFields={formFields} /> */}
        </>
      );
    }}
  </AddContributionForm>
);

export default connect(
  state => ({
    currentUserId: state.auth.me.id,
    governmentId: state.auth.me.permissions[0].id,
    campaignId: state.auth.me.permissions[0].campaignId,
  }),
  dispatch => ({
    createContribution: data => dispatch(createContribution(data)),
  })
)(AddContribution);
