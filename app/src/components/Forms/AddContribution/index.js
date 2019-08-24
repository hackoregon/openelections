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
  ContributionStatusEnum,
  mapContributionFormToData,
} from '../../../api/api';
import {
  AddHeaderSection,
  BasicsSection,
  ContributorSection,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsSections';
import { contributionsEmptyState } from '../../../Pages/Portal/Contributions/Utils/ContributionsFields';

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
    {({ formFields, isValid, handleSubmit, visibleIf, formErrors }) => {
      console.log('Required fields', Object.keys(formErrors));

      return (
        <>
          <AddHeaderSection isValid={isValid} handleSubmit={handleSubmit} />
          <BasicsSection
            formFields={formFields}
            checkSelected={visibleIf.checkSelected}
            showInKindFields={visibleIf.showInKindFields}
            showPaymentMethod={visibleIf.paymentMethod}
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
