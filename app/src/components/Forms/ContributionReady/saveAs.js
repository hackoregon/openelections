import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { flashMessage } from 'redux-flash';
import { push } from 'connected-react-router';
import {
  updateContribution,
  getContributionById,
  getCurrentContribution,
  createContribution,
} from '../../../state/ducks/contributions';
import {
  getCurrentUserId,
  getCurrentCampaignName,
  isGovAdmin,
  isCampAdmin,
  isCampStaff,
  getCurrentCampaignId,
} from '../../../state/ducks/auth';
import { getCurrentGovernmentId } from '../../../state/ducks/governments';
import {
  ViewHeaderSection,
  BasicsSection,
  ContributorSection,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsSections';
import {
  mapContributionFormToData,
  mapContributionDataToForm,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsFields';
import AddContributionForm from '../AddContribution/AddContributionForm';
import { ContributionStatusEnum, dateToMicroTime } from '../../../api/api';
import ReadOnly from '../../ReadOnly';
import { PageTransitionImage } from '../../PageTransistion';

const onSubmitAdd = (data, props) => {
  const { currentUserId, governmentId, campaignId, createContribution } = props;
  const contributionData = mapContributionFormToData(data);
  const payload = {
    status: ContributionStatusEnum.DRAFT,
    governmentId,
    campaignId,
    currentUserId,
    ...contributionData,
  };
  createContribution(payload);
};

const onSubmit = (data, props) => {
  if (data.buttonSubmitted === 'save') {
    return onSubmitAdd(data, props);
  }
  // Only PUT changed fields by comparing initialValues to submitted values
  const initialValues = props.currentContribution;
  const submittedValues = mapContributionFormToData(data);
  const alteredValues = {};

  // All dates must be converted to microtime to compare
  if (initialValues.occupationLetterDate) {
    initialValues.occupationLetterDate = dateToMicroTime(
      initialValues.occupationLetterDate
    );
  }
  initialValues.date = dateToMicroTime(initialValues.date);
  for (const [field, value] of Object.entries(submittedValues)) {
    if (value !== initialValues[field]) {
      if (!(!alteredValues[field] && !value)) alteredValues[field] = value;
    }
  }

  switch (data.buttonSubmitted) {
    case 'archive':
      alteredValues.status = ContributionStatusEnum.ARCHIVED;
      break;
    case 'move_to_draft':
      alteredValues.status = ContributionStatusEnum.DRAFT;
      break;
    case 'save':
      // The record should be in draft whne save is available.
      // alteredValues.status = ContributionStatusEnum.DRAFT;
      break;
    case 'submit':
      alteredValues.status = ContributionStatusEnum.SUBMITTED;
      break;
    case 'processed':
      alteredValues.status = ContributionStatusEnum.PROCESSED;
      break;
    // Button that does not set buttonSubmitted would return to the
    // contributions list without updating the record
    default:
  }

  if (Object.keys(alteredValues).length) {
    alteredValues.id = data.id;
    alteredValues.currentUserId = props.currentUserId;
    props.updateContribution(alteredValues);
  } else {
    props.push('/contributions');
  }
};

class ContributionReadyForm extends React.Component {
  constructor(props) {
    super(props);
    const { getContributionById, contributionId } = this.props;
    if (contributionId) getContributionById(parseInt(contributionId));
  }

  render() {
    const {
      contributionId,
      currentContribution,
      flashMessage,
      isCampAdmin,
      isCampStaff,
      isGovAdmin,
      campaignName,
    } = this.props;
    let initialFormData = {};
    if (currentContribution) {
      initialFormData = mapContributionDataToForm(currentContribution);
    }
    const isReadOnly = !!(
      isGovAdmin ||
      initialFormData.status === ContributionStatusEnum.SUBMITTED ||
      initialFormData.status === ContributionStatusEnum.ARCHIVED ||
      initialFormData.status === ContributionStatusEnum.PROCESSED
    );
    return (
      <AddContributionForm
        onSubmit={data => onSubmit(data, this.props)}
        initialValues={initialFormData}
      >
        {({
          formFields,
          isValid,
          handleSubmit,
          visibleIf,
          formErrors,
          values,
        }) => {
          const isSubmited = !!(
            values.status === ContributionStatusEnum.SUBMITTED
          );
          if (values.buttonSubmitted && !isValid) {
            // eslint-disable-next-line no-unused-vars
            for (const [key, value] of Object.entries(formErrors)) {
              values.buttonSubmitted = '';
              flashMessage(value, { props: { variant: 'error' } });
            }
          }
          return parseInt(values.id) !== parseInt(contributionId) ? (
            <PageTransitionImage />
          ) : (
            <>
              <ViewHeaderSection
                campaignName={values.campaignName || campaignName}
                isCampAdmin={isCampAdmin}
                isCampStaff={isCampStaff}
                isGovAdmin={this.props.isGovAdmin}
                isValid={isValid}
                handleSubmit={handleSubmit}
                id={initialFormData.id}
                updatedAt={initialFormData.updatedAt}
                status={initialFormData.status}
                formValues={values}
              />
              <ReadOnly ro={isReadOnly}>
                <BasicsSection
                  isSubmited={isSubmited}
                  formFields={formFields}
                  checkSelected={visibleIf.checkSelected}
                  showInKindFields={visibleIf.showInKindFields}
                  showPaymentMethod={visibleIf.paymentMethod}
                  showMatchAmount={currentContribution.matchAmount}
                  showCompliant={currentContribution.compliant}
                />
                <ContributorSection
                  isSubmited={isSubmited}
                  formFields={formFields}
                  showEmployerSection={visibleIf.showEmployerSection}
                  isPerson={visibleIf.isPerson}
                  emptyOccupationLetterDate={
                    visibleIf.emptyOccupationLetterDate
                  }
                  isGovAdmin={isGovAdmin}
                  contributionId={values.id}
                  matchId={currentContribution.matchId}
                  showOccupationLetter={visibleIf.showOccupationLetter}
                />
              </ReadOnly>
            </>
          );
        }}
      </AddContributionForm>
    );
  }
}

export default connect(
  state => ({
    governmentId: getCurrentGovernmentId(state),
    campaignId: getCurrentCampaignId(state),
    currentUserId: getCurrentUserId(state),
    isGovAdmin: isGovAdmin(state),
    isCampAdmin: isCampAdmin(state),
    isCampStaff: isCampStaff(state),
    campaignName: getCurrentCampaignName(state),
    currentContribution: getCurrentContribution(state),
  }),
  dispatch => ({
    push: url => dispatch(push(url)),
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    updateContribution: data => dispatch(updateContribution(data)),
    getContributionById: id => dispatch(getContributionById(id)),
    createContribution: data => dispatch(createContribution(data)),
  })
)(ContributionReadyForm);
