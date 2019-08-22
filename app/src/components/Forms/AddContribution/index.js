import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { createContribution } from '../../../state/ducks/contributions';
import {
  getCurrentCampaignId,
  getCurrentUserId,
} from '../../../state/ducks/auth';
import { getCurrentGovernmentId } from '../../../state/ducks/governments';
import AddContributionForm from './AddContributionForm';
import {
  // ContributionTypeFieldEnum,
  ContributionStatusEnum,
  mapContributionFormToData,
  // ContributionSubTypeFieldEnum,
  // ContributionSubTypeEnum,
  // ContributionTypeEnum,
  // ContributorTypeEnum,
  // ContributorTypeFieldEnum,
} from '../../../api/api';
import {
  AddHeaderSection,
  BasicsSection,
  ContributorSection,
  // OtherDetailsSection,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsSections';
import {
  contributionsEmptyState,
  // inKindContributionValues,
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
    {({ formFields, isValid, handleSubmit, visibleIf, formikProps }) => {
      console.log('formikProps', formikProps);
      // const isPerson = !!(
      //   values.typeOfContributor === ContributorTypeEnum.INDIVIDUAL ||
      //   values.typeOfContributor === ContributorTypeEnum.FAMILY
      // );
      // const checkSelected =
      //   values.paymentMethod === 'Check' ||
      //   values.paymentMethod === 'Money Order';

      // // Only show Employer section if the contributor type is Individual OR Family AND Occupation is 'Employed'
      // const emptyOccupationLetterDate = values.occupationLetterDate === '';
      // const showEmployerSection = values.occupation === 'Employed';
      // const showInKindFields = !!inKindContributionValues.includes(
      //   values.subTypeOfContribution
      // );

      // if (values.submitForMatch !== 'No') {
      //   if (
      //     // Set submitForMatch to No under these conditions
      //     values.amountOfContribution > 500 ||
      //     valques.typeOfContribution !== ContributionTypeEnum.CONTRIBUTION ||
      //     values.subTypeOfContribution !== ContributionSubTypeEnum.CASH ||
      //     !isPerson
      //   ) {
      //     values.submitForMatch = 'No';
      //   }
      // }

      return (
        <>
          <AddHeaderSection isValid={isValid} handleSubmit={handleSubmit} />
          <BasicsSection
            formFields={formFields}
            checkSelected={visibleIf.checkSelected}
            showInKindFields={visibleIf.showInKindFields}
          />
          <ContributorSection
            formFields={formFields}
            showEmployerSection={visibleIf.showEmployerSection}
            isPerson={visibleIf.isPerson}
            emptyOccupationLetterDate={visibleIf.emptyOccupationLetterDate}
          />
          {/* <OtherDetailsSection formFields={formFields} /> */}
        </>
      );
    }}
  </AddContributionForm>
);

export default connect(
  state => ({
    currentUserId: getCurrentUserId(state),
    governmentId: getCurrentGovernmentId(state),
    campaignId: getCurrentCampaignId(state),
  }),
  dispatch => ({
    createContribution: data => dispatch(createContribution(data)),
  })
)(AddContribution);
