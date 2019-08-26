import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { updateContribution } from '../../../state/ducks/contributions';
import { getCurrentUserId } from '../../../state/ducks/auth';
import {
  AddHeaderSection,
  ViewHeaderSection,
  BasicsSection,
  ContributorSection,
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
  // const updateAttributes = data;
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
      // Only submit dirty fields
      contributionData.status = ContributionStatusEnum.SUBMITTED;
      break;
    default:
    // code block
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

  props
    .updateContribution(contributionData)
    .then(() => props.history.push('/contributions'));
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
          initialValues,
        }) => {
          console.log(formErrors);
          console.log(initialValues);
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
  }
}

export default connect(
  state => ({
    currentUserId: getCurrentUserId(state),
  }),
  dispatch => ({
    updateContribution: data => dispatch(updateContribution(data)),
  })
)(ContributionReadyForm);
