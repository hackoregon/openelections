import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import SelectField from '../../../../components/Fields/SelectField';
import { getContributions } from '../../../../state/ducks/contributions';
import { isLoggedIn } from '../../../../state/ducks/auth';

const paginateOptions = css`
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
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
  max-width: 100% !important;
`;

const totalsSection = css`
  width: 100%;
  padding: 12px;
  > p {
    margin: 0;
  }
`;

const TablePagination = props => {
  const {
    setPageNumber,
    pageNumber,
    prevDisabled,
    nextDisabled,
    totalPages,
    initialValues,
    campaignDataPersistence,
    setCampaignDataPersistence,
  } = props;

  function submitPageChange(currentPage) {
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
    props.getContributions(data);
    setCampaignDataPersistence(data);
  }

  return (
    <>
      <div css={paginateOptions}>
        {/* {formSections.paginate} */}
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
          <div css={totalsSection}>
            <p>
              {pageNumber + 1} {' of '}
              {Math.ceil(props.totalResults / initialValues.perPage)}
              {' pages'}
            </p>
          </div>
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
                  console.log({ total });
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
    </>
  );
};

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
)(TablePagination);
