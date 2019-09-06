import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
import Button from '../../Button/Button';
import FilterContributions from './FilterContributions';
import { getContributions } from '../../../state/ducks/contributions';
/** @jsx jsx */
import { isLoggedIn } from '../../../state/ducks/auth';

const STATUS_OPTIONS = {
  'All Statuses': 'all',
  Archived: 'Archived',
  Draft: 'Draft',
  Submitted: 'Submitted',
  Processed: 'Processed',
};

const ORDER_OPTIONS = {
  Descending: 'DESC',
  Ascending: 'ASC',
};

const SORT_OPTIONS = {
  'Campaign Id': 'campaignId',
  Status: 'status',
  Date: 'date',
};

const filterOuter = css`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  > div {
    margin: 0 5px;
  }
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const filterInner = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  // flex-wrap: wrap;
  > div {
    margin: 5px;
  }
  @media screen and (max-width: 900px) {
    flex-wrap: wrap;
    > div {
      width: calc(50% - 10px);
    }
  }
`;

const btnContainer = css`
  display: flex;
  flex-direction: row;
  > button {
    margin: 5px;
  }
`;

const FilterContribution = props => (
  <>
    <FilterContributions
      onSubmit={filterOptions => {
        const data = {
          governmentId: props.govId,
          currentUserId: props.userId,
          campaignId: props.campaignId,
        };

        if (filterOptions.status && filterOptions.status !== 'All Statuses') {
          data.status = STATUS_OPTIONS[filterOptions.status];
        }

        if (filterOptions.sortBy || filterOptions.orderBy) {
          data.sort = {
            field: SORT_OPTIONS[filterOptions.sortBy] || SORT_OPTIONS.Date,
            direction:
              ORDER_OPTIONS[filterOptions.orderBy] || ORDER_OPTIONS.Descending,
          };
        }

        if (filterOptions.range) {
          if (filterOptions.range.from) {
            data.from = filterOptions.range.from;
          }

          if (filterOptions.range.to) {
            data.to = filterOptions.range.to;
          }
        }
        console.log('Sending: ', { data });
        props.getContributions(data);
      }}
      initialValues={{
        status: '',
        range: {
          to: '',
          from: '',
        },
        orderBy: '',
        sortBy: '',
      }}
    >
      {({
        formSections,
        isValid,
        handleSubmit,
        isDirty,
        /* isSubmitting */
        handleCancel,
      }) => (
        <div className="nark" css={filterOuter}>
          <div css={filterInner}>{formSections.filter}</div>
          <div css={btnContainer}>
            <Button
              buttonType="submit"
              disabled={!isValid}
              onClick={handleSubmit}
            >
              Filter
            </Button>
            <Button
              buttonType="submit"
              disabled={!isDirty}
              onClick={() => {
                handleCancel();
                handleSubmit();
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </FilterContributions>
  </>
);

// export default FilterContribution;
export default connect(
  state => ({
    orgId:
      state.campaigns.currentCampaignId ||
      state.governments.currentGovernmentId,
    campaignId: state.campaigns.currentCampaignId,
    govId: state.governments.currentGovernmentId || 1,
    userId: isLoggedIn(state) ? state.auth.me.id : null,
  }),
  dispatch => {
    return {
      getContributions: data => dispatch(getContributions(data)),
    };
  }
)(FilterContribution);
