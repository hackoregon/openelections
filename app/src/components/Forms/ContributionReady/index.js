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
} from '../../../state/ducks/contributions';
import {
  getCurrentUserId,
  getCurrentCampaignName,
  isGovAdmin,
  isCampAdmin,
  isCampStaff,
} from '../../../state/ducks/auth';
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
import PreviousDonationsTable from '../../PreviousDonations/PreviousDonationsTable';
import ActivityStreamForm from '../ActivityStream/index';

const onSubmit = (data, props) => {
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
      break;
    case 'submit':
      alteredValues.status = ContributionStatusEnum.SUBMITTED;
      break;
    case 'processed':
      alteredValues.status = ContributionStatusEnum.PROCESSED;
      break;
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
      pastContributions,
      history,
    } = this.props;
    let initialFormData = {};
    if (currentContribution) {
      initialFormData = mapContributionDataToForm(currentContribution);
    }
    let matchId = null;
    if (currentContribution) {
      matchId = currentContribution.matchId
        ? currentContribution.matchId
        : null;
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
              {isGovAdmin ? (
                <div style={{ paddingTop: '50px' }}>
                  <PreviousDonationsTable
                    matchId={matchId}
                    history={history}
                    currentId={currentContribution.id}
                    pastContributions={pastContributions.list[matchId]}
                  />
                </div>
              ) : null}
              {/* {isSubmited && this.props.isGovAdmin ? ( */}
              <ActivityStreamForm
                isValid={isValid}
                onSubmit={onSubmit}
                contributionId={this.props.id}
                activitiesList={this.props.activitiesList}
                postComment={this.props.postComment}
              />
              {/* ) : null} */}
            </>
          );
        }}
      </AddContributionForm>
    );
  }
}

export default connect(
  state => ({
    currentUserId: getCurrentUserId(state),
    isGovAdmin: isGovAdmin(state),
    isCampAdmin: isCampAdmin(state),
    isCampStaff: isCampStaff(state),
    campaignName: getCurrentCampaignName(state),
    currentContribution: getCurrentContribution(state),
    pastContributions: state.pastContributions,
  }),
  dispatch => ({
    push: url => dispatch(push(url)),
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    updateContribution: data => dispatch(updateContribution(data)),
    getContributionById: id => dispatch(getContributionById(id)),
  })
)(ContributionReadyForm);
