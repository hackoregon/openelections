import React from 'react';
import { connect } from 'react-redux';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { getExpenditureActivities } from '../../../state/ducks/activities';
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
};

// const payload = {    REQUEST PAYLOAD EXAMPLE
// governmentId: 1,
// campaignId: 1,
// contributionId: 18,
// expenditureId: 17,
// perPage: 6,
// page: 1,
// };

// {                    RESPONSE BODY EXAMPLE
//   "id": 65,
//   "userId": 2,
//   "notes": "Campaign Admin added a contribution (68).",
//   "campaignId": 1,
//   "activityId": 68,
//   "activityType": "contribution"
// },

export const mapActivityDataToForm = activity => {
  const {
    id,
    user, // - in entity class but not IActivityResult - userId
    notes,
    campaign, // campaignId,
    activityId,
    activityType,
    // government, - in entity class but not IActivityResult
    // contribution, - in entity class but not IActivityResult
    // expenditure, - in entity class but not IActivityResult
    createdAt, // - in entity class but not IActivityResult
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

const activitiesSwaggerResponse = [
  {
    id: 67,
    userId: 2,
    notes: 'Campaign Admin added a contribution (64).',
    campaignId: 1,
    activityId: 64,
    activityType: 'contribution',
    createdAt: Date.now(),
  },
  {
    id: 66,
    userId: 2,
    notes: 'Campaign Admin added a contribution (65).',
    campaignId: 1,
    activityId: 65,
    activityType: 'contribution',
    createdAt: Date.now(),
  },
  {
    id: 65,
    userId: 2,
    notes: 'Campaign Admin added a contribution (68).',
    campaignId: 1,
    activityId: 68,
    activityType: 'contribution',
    createdAt: Date.now(),
  },
  {
    id: 64,
    userId: 2,
    notes: 'Campaign Admin added a contribution (67).',
    campaignId: 1,
    activityId: 67,
    activityType: 'contribution',
    createdAt: Date.now(),
  },
  {
    id: 63,
    userId: 2,
    notes: 'Campaign Admin added a contribution (60).',
    campaignId: 1,
    activityId: 60,
    activityType: 'contribution',
    createdAt: Date.now(),
  },
  {
    id: 62,
    userId: 2,
    notes: 'Campaign Admin added a contribution (63).',
    campaignId: 1,
    activityId: 63,
    activityType: 'contribution',
    createdAt: Date.now(),
  },
];

const onSubmit = (data, props) => {
  const activitiesData = mapActivityDataToForm(data);
  mapActivityDataToForm.id = data.id;
  mapActivityDataToForm.currentUserId = props.currentUserId;
  getExpenditureActivities(activitiesData).then(
    data => props.history.push(`/contributions/${data}`) // Add /comments path?
  );
};

const activitiesArray = [];
const activityList = () => {
  Object.values(activitiesSwaggerResponse).map(activity => {
    activitiesArray.push(activity);
    return activitiesArray;
  });
};

activityList();

const Activity = ({ ...props }) => (
  <Activity
    userId={props.userId}
    notes={props.notes}
    activityType={props.activityType}
  />
);

const ActivityStream = ({
  contributionId,
  data,
  getAllExpenditureActivities,
  activitiesById,
  ...props
}) => {
  //   function fetchList(filterOptions, sortOptions, paginationOptions) {
  //     const data = {
  //       governmentId: props.govId,
  //       currentUserId: props.userId,
  //       campaignId: props.campaignId,
  //       ...paginationOptions,
  //       ...filterOptions,
  //       ...sortOptions,
  //     };
  //     props.getExpenditures(data);
  //   }
  // };
  console.log(props);
  console.log('getAllExpenditureActivities: ', getAllExpenditureActivities());
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
              activitiesSwaggerResponse={activitiesSwaggerResponse}
              activitiesArray={activitiesArray}
            />
          );
        }}
      </ActivityStreamForm>
    </>
  );
};

export default connect(
  (props, state) => ({
    governmentId: getCurrentGovernmentId(state),
    contributionId: props.id,
    activitiesById: getExpenditureActivities,
  }),
  dispatch => ({
    getAllExpenditureActivities: () => dispatch(getExpenditureActivities(1)),
  })
)(ActivityStream);
