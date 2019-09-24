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
    createdAt: format(
      new Date(
        parseFromTimeZone(Date.now(), { timeZone: 'America/Los_Angeles' })
      ),
      'MM-DD-YYYY @hh:mm'
    ),
  },
  {
    id: 66,
    userId: 2,
    notes: 'Campaign Admin added a contribution (65).',
    campaignId: 1,
    activityId: 65,
    activityType: 'contribution',
    createdAt: format(
      new Date(
        parseFromTimeZone(Date.now(), { timeZone: 'America/Los_Angeles' })
      ),
      'MM-DD-YYYY @hh:mm'
    ),
  },
  {
    id: 65,
    userId: 2,
    notes: 'Campaign Admin added a contribution (68).',
    campaignId: 1,
    activityId: 68,
    activityType: 'contribution',
    createdAt: format(
      new Date(
        parseFromTimeZone(Date.now(), { timeZone: 'America/Los_Angeles' })
      ),
      'MM-DD-YYYY @hh:mm'
    ),
  },
  {
    id: 64,
    userId: 2,
    notes: 'Campaign Admin added a contribution (67).',
    campaignId: 1,
    activityId: 67,
    activityType: 'contribution',
    createdAt: format(
      new Date(
        parseFromTimeZone(Date.now(), { timeZone: 'America/Los_Angeles' })
      ),
      'MM-DD-YYYY @hh:mm'
    ),
  },
  {
    id: 63,
    userId: 2,
    notes: 'Campaign Admin added a contribution (60).',
    campaignId: 1,
    activityId: 60,
    activityType: 'contribution',
    createdAt: format(
      new Date(
        parseFromTimeZone(Date.now(), { timeZone: 'America/Los_Angeles' })
      ),
      'MM-DD-YYYY @hh:mm'
    ),
  },
  {
    id: 62,
    userId: 2,
    notes: 'Campaign Admin added a contribution (63).',
    campaignId: 1,
    activityId: 63,
    activityType: 'contribution',
    createdAt: format(
      new Date(
        parseFromTimeZone(Date.now(), { timeZone: 'America/Los_Angeles' })
      ),
      'MM-DD-YYYY @hh:mm'
    ),
  },
];

const onSubmit = (data, props) => {
  const activitiesData = mapActivityDataToForm(data);
  mapActivityDataToForm.id = data.id;
  mapActivityDataToForm.currentUserId = props.currentUserId;
  getActivities(activitiesData).then(data =>
    props.history.push(`/activities/${data}`)
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
  getAllActivities,
  ...props
}) => {
  // function fetchList(filterOptions, sortOptions, paginationOptions) {
  //   const data = {
  //     governmentId: props.govId,
  //     currentUserId: props.userId,
  //     campaignId: props.campaignId,
  //     ...paginationOptions,
  //     ...filterOptions,
  //     ...sortOptions,
  //   };
  //   getAllActivities(data);
  // }
  // };
  console.log('getAllActivities: ', getAllActivities);
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
    contributionOrExpenditureId: props.id,
    getActivitiesById: getActivities(1),
  }),
  dispatch => ({
    getAllActivities: () => dispatch(getActivities(1)),
  })
)(ActivityStream);
