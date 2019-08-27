import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { flashMessage } from 'redux-flash';
import { updateContribution } from '../../../state/ducks/contributions';
import { getCurrentUserId } from '../../../state/ducks/auth';
import {
  AddHeaderSection,
  ViewHeaderSection,
  BasicsSection,
  ContributorSection,
  OtherDetailsSection,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsSections';
import { contributionsEmptyState } from '../../../Pages/Portal/Contributions/Utils/ContributionsFields';
import AddContributionForm from '../AddContribution/AddContributionForm';
import {
  ContributionStatusEnum,
  mapContributionFormToData,
} from '../../../api/api';

const onSubmit = (data, props) => {
  const initialData = props.data;
  const contributionData = mapContributionFormToData(data);
  delete contributionData.date;
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
  //   console.log(key, data[key]);
  //   if (initialData[key]) {
  //     if (data[key] !== initialData[key]) {
  //       updateAttributes[key] = data[key];
  //     }
  //   }
  // }
  if (contributionData.status) {
    props
      .updateContribution(contributionData)
      .then(() => props.history.push('/contributions'));
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
    this.state = {
      isLoading: true,
    };
  }

  render() {
    return (
      <AddContributionForm
        onSubmit={data => onSubmit(data, this.props)}
        initialValues={this.props.data}
      >
        {({
          formFields,
          isValid,
          handleSubmit,
          visibleIf,
          formErrors,
          values,
        }) => {
          // TODO Next line used to disable sections move to fields object and dynamic validate
          const isSubmited = !!(
            values.status === ContributionStatusEnum.SUBMITTED
          );
          if (values.buttonSubmitted && !isValid) {
            for (const [key, value] of Object.entries(formErrors)) {
              values.buttonSubmitted = '';
              this.props.flashMessage(value, { props: { variant: 'error' } });
            }
          }
          return (
            <>
              <ViewHeaderSection
                isValid={isValid}
                handleSubmit={handleSubmit}
                onSubmitSave={onSubmitSave}
                id={this.props.data.id}
                updatedAt={this.props.data.updatedAt}
                status={this.props.data.status}
                formValues={values}
              />
              <BasicsSection
                isSubmited={isSubmited}
                formFields={formFields}
                checkSelected={visibleIf.checkSelected}
                showInKindFields={visibleIf.showInKindFields}
              />
              <ContributorSection
                isSubmited={isSubmited}
                formFields={formFields}
                showEmployerSection={visibleIf.showEmployerSection}
                isPerson={visibleIf.isPerson}
                emptyOccupationLetterDate={visibleIf.emptyOccupationLetterDate}
              />
              {isSubmited ? (
                <OtherDetailsSection formFields={formFields} />
              ) : null}
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
  }),
  dispatch => ({
    flashMessage: (message, options) =>
      dispatch(flashMessage(message, options)),
    updateContribution: data => dispatch(updateContribution(data)),
  })
)(ContributionReadyForm);
