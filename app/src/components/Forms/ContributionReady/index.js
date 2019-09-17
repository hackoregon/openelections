import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { flashMessage } from 'redux-flash';
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
  AddHeaderSection,
  ViewHeaderSection,
  BasicsSection,
  ContributorSection,
  OtherDetailsSection,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsSections';
import {
  mapContributionFormToData,
  mapContributionDataToForm,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsFields';
import AddContributionForm from '../AddContribution/AddContributionForm';
import { ContributionStatusEnum, ContributorTypeEnum } from '../../../api/api';
import ReadOnly from '../../ReadOnly';
import { PageTransitionImage } from '../../PageTransistion';

const onSubmit = (data, props) => {
  const initialData = props.data;
  const contributionData = mapContributionFormToData(data);
  delete contributionData.calendarYearAggregate;
  contributionData.id = data.id;
  contributionData.currentUserId = props.currentUserId;
  switch (data.buttonSubmitted) {
    case 'archive':
      contributionData.status = ContributionStatusEnum.ARCHIVED;
      break;
    case 'move_to_draft':
      contributionData.status = ContributionStatusEnum.DRAFT;
      break;
    case 'save':
      contributionData.status = ContributionStatusEnum.DRAFT;
      break;
    case 'submit':
      contributionData.status = ContributionStatusEnum.SUBMITTED;
      break;
    // Button that does not set buttonSubmitted would return to the
    // contributions list without updating the record
    default:
      contributionData.status = false;
  }
  // TODO only send dirty fields
  // for (const key of Object.keys(data)) {
  //   if (initialData[key]) {
  //     if (data[key] !== initialData[key]) {
  //       updateAttributes[key] = data[key];
  //     }
  //   }
  // }
  if (contributionData.status) {
    props.updateContribution(contributionData);
  } else {
    props.history.push('/contributions');
  }
};

const onSubmitSave = (data, props) => {
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
    let data = {};
    if (currentContribution) {
      data = mapContributionDataToForm(currentContribution);
    }
    const isReadOnly = !!(
      isGovAdmin || data.status === ContributionStatusEnum.SUBMITTED
    );
    return (
      <AddContributionForm
        onSubmit={data => onSubmit(data, this.props)}
        initialValues={data}
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
                isValid={isValid}
                handleSubmit={handleSubmit}
                onSubmitSave={onSubmitSave}
                id={data.id}
                updatedAt={data.updatedAt}
                status={data.status}
                formValues={values}
              />
              <ReadOnly ro={isReadOnly}>
                <BasicsSection
                  isSubmited={isSubmited}
                  formFields={formFields}
                  checkSelected={visibleIf.checkSelected}
                  showInKindFields={visibleIf.showInKindFields}
                  showPaymentMethod={visibleIf.paymentMethod}
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
    currentUserId: getCurrentUserId(state),
    isGovAdmin: isGovAdmin(state),
    isCampAdmin: isCampAdmin(state),
    isCampStaff: isCampStaff(state),
    campaignName: getCurrentCampaignName(state),
    currentContribution: getCurrentContribution(state),
  }),
  dispatch => ({
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    updateContribution: data => dispatch(updateContribution(data)),
    getContributionById: id => dispatch(getContributionById(id)),
  })
)(ContributionReadyForm);
