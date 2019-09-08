import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';

import Tooltip from '@material-ui/core/Tooltip';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

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
const filterWrapper = css`
  display: flex;
  flex-direction: column;
  width: 100%;
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

const paginateOptions = css`
  margin: 10px 0;
  display: flex;
  > div {
    max-width: 25%;
  }
  @media screen and (max-width: 900px) {
    > div {
      max-width: 50%;
    }
  }
`;

const pageNav = css`
  display: flex;
  flex-direction: row;
`;

const btnContainer = css`
  display: flex;
  flex-direction: row;
  > button {
    margin: 5px;
  }
`;

const FilterContribution = props => {
  const [pageNumber, setPageNumber] = useState(0);
  const [campaignDataPersistence, setCampaignDataPersistence] = useState(null);
  const prevDisabled = pageNumber <= 0;
  // TODO: update 50 to be dynamic
  const nextDisabled = props.totalResults <= (pageNumber + 1) * 50;
  const totalPages =
    props.totalResults /
    (campaignDataPersistence ? campaignDataPersistence.perPage : 50);
  function submitPageChange(currentPage) {
    // let data = {};
    const data = {
      governmentId: campaignDataPersistence
        ? campaignDataPersistence.governmentId
        : props.govId,
      currentUserId: campaignDataPersistence
        ? campaignDataPersistence.currentUserId
        : props.userId,
      campaignId: campaignDataPersistence
        ? campaignDataPersistence.campaignId
        : props.campaignId,
      perPage: campaignDataPersistence ? campaignDataPersistence.perPage : 50,
      page: currentPage,
    };
    if (campaignDataPersistence && campaignDataPersistence.status) {
      data.status = campaignDataPersistence.status;
    }
    if (campaignDataPersistence && campaignDataPersistence.from) {
      data.from = campaignDataPersistence.from;
    }
    if (campaignDataPersistence && campaignDataPersistence.to) {
      data.to = campaignDataPersistence.to;
    }
    if (campaignDataPersistence && campaignDataPersistence.sort) {
      data.sort = campaignDataPersistence.sort;
    }
    console.log({ data });
    props.getContributions(data);
    setCampaignDataPersistence(data);
  }
  useEffect(() => {
    console.log('doin shitttt');
  });

  return (
    <>
      <FilterContributions
        onSubmit={filterOptions => {
          const data = {
            governmentId: props.govId,
            currentUserId: props.userId,
            campaignId: props.campaignId,
            perPage: filterOptions.perPage
              ? parseInt(filterOptions.perPage)
              : 50,
            page: 0,
          };

          if (filterOptions.status && filterOptions.status !== 'All Statuses') {
            data.status = STATUS_OPTIONS[filterOptions.status];
          }
          console.log({ pageNumber });
          if (filterOptions.sortBy || filterOptions.orderBy) {
            data.sort = {
              field: SORT_OPTIONS[filterOptions.sortBy] || SORT_OPTIONS.Date,
              direction:
                ORDER_OPTIONS[filterOptions.orderBy] ||
                ORDER_OPTIONS.Descending,
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
          setCampaignDataPersistence(data);
          setPageNumber(0);
        }}
        initialValues={{
          status: '',
          range: {
            to: '',
            from: '',
          },
          orderBy: '',
          sortBy: '',
          perPage: '50',
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
            <div css={filterWrapper}>
              <div css={filterInner}>{formSections.filter}</div>
              <div css={paginateOptions}>
                {formSections.paginate}
                <div css={pageNav}>
                  <Tooltip title="First Page">
                    <div>
                      <IconButton
                        aria-label="first page"
                        onClick={() => {
                          setPageNumber(0);
                          submitPageChange(pageNumber - 1);
                        }}
                        disabled={prevDisabled}
                      >
                        <FirstPageIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                  <Tooltip title="Previous Page">
                    <div>
                      <IconButton
                        aria-label="previous page"
                        onClick={() => {
                          setPageNumber(pageNumber - 1);
                          submitPageChange(pageNumber - 1);
                        }}
                        disabled={prevDisabled}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                  <Tooltip title="Next Page">
                    <div>
                      <IconButton
                        aria-label="Next page"
                        onClick={() => {
                          setPageNumber(pageNumber + 1);
                          submitPageChange(pageNumber + 1);
                        }}
                        disabled={nextDisabled}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                  <Tooltip title="Last Page">
                    <div>
                      <IconButton
                        aria-label="last page"
                        onClick={() => {
                          const total = totalPages;
                          setPageNumber(total);
                          submitPageChange(total);
                        }}
                        disabled={nextDisabled}
                      >
                        <LastPageIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
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
                  setPageNumber(0);
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
};

// export default FilterContribution;
export default connect(
  state => ({
    orgId:
      state.campaigns.currentCampaignId ||
      state.governments.currentGovernmentId,
    campaignId: state.campaigns.currentCampaignId,
    govId: state.governments.currentGovernmentId || 1,
    userId: isLoggedIn(state) ? state.auth.me.id : null,
    totalResults: state.contributions.total,
  }),
  dispatch => {
    return {
      getContributions: data => dispatch(getContributions(data)),
    };
  }
)(FilterContribution);
