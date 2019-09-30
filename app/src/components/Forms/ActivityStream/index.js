import React from 'react';
import { connect } from 'react-redux';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { parseFromTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';
import { getActivities } from '../../../state/ducks/activities';
import { getCurrentGovernmentId } from '../../../state/ducks/governments';
import ActivityStreamForm from './ActivityStreamForm';
import { ActivitySection } from './ActivitySection';

export const activitiesEmptyState = {
  id: null,
  userId: null,
  notes: '',
  campaignId: null,
  activityId: null,
  activityType: '',
  createdAt: null,
};

export const mapActivityDataToForm = activity => {
  const {
    id,
    user,
    notes,
    campaign, // campaignId,
    activityId,
    activityType,
    createdAt,
  } = activity;
  return {
    id,
    userId: user, // userId, - in IActivityResult but not entity class
    notes,
    campaignId: campaign,
    activityId,
    activityType,
    createdAt,
  };
};

const onSubmit = (data, props) => {
  const activitiesData = mapActivityDataToForm(data);
  mapActivityDataToForm.id = data.id;
  mapActivityDataToForm.currentUserId = props.currentUserId;
  getActivities(activitiesData).then(data =>
    props.history.push(`/activities/${data}`)
  );
};

const ActivityStream = ({
  contributionId,
  expenditureId,
  type,
  data,
  getAllActivities,
  activitiesList,
  ...props
}) => {
  return (
    <>
      <ActivityStreamForm
        onSubmit={data => onSubmit(data, props)}
        initialValues={activitiesEmptyState}
      >
        {({ formFields, isValid, initialValues, onSubmit }) => {
          return (
            <ActivitySection
              onSubmit={onSubmit}
              initialValues={initialValues}
              formFields={formFields}
              isValid={isValid}
              activitiesArray={activitiesList}
              contributionId={contributionId}
              expenditureId={expenditureId}
              type={type}
            />
          );
        }}
      </ActivityStreamForm>
    </>
  );
};

// const payload = {    REQUEST PAYLOAD EXAMPLE
// governmentId: 1,
// campaignId: 1,
// contributionId: 18,
// expenditureId: 17,
// perPage: 6,
// page: 1,
// };

export default connect((props, state) => ({
  governmentId: getCurrentGovernmentId(state),
  contributionOrExpenditureId: props.id,
}))(ActivityStream);
