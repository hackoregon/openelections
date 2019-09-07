import React, { useState } from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { withRouter } from 'react-router-dom';
import Button from '../../Button/Button';
import FilterContributions from './FilterContributions';
import { getContributions } from '../../../state/ducks/contributions';
import { isLoggedIn } from '../../../state/ducks/auth';

const wtf = css`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  > div {
    margin: 0 5px;
  }
`;

const filterControls = css`
  text-align: center;

  a.reset-button {
    text-align: center;
    font-size: 14px;
    transition: opacity 0.1s;
    cursor: pointer;
    &[disabled] {
      opacity: 0;
      color: gray;
    }
  }
`;

const FilterContribution = props => {
  const { location, history } = props;

  // eslint-disable-next-line no-use-before-define
  const urlQuery = getQueryParams(location);

  const defaultValues = {
    status: 'all',
    range: { to: '', from: '' },
  };
  const [initialValues, setInitialValues] = useState({
    status: urlQuery.status || defaultValues.status,
    range: {
      to: urlQuery.to || '',
      from: urlQuery.from || '',
    },
  });

  return (
    <>
      <FilterContributions
        onSubmit={filterOptions => {
          const data = {
            governmentId: props.govId,
            currentUserId: props.userId,
            campaignId: props.campaignId,
          };

          if (filterOptions.status && filterOptions.status !== 'all') {
            data.status = filterOptions.status;
            urlQuery.status = filterOptions.status;
          }

          if (filterOptions.range) {
            if (filterOptions.range.from) {
              data.from = filterOptions.range.from;
              urlQuery.from = filterOptions.range.from;
            }

            if (filterOptions.range.to) {
              data.to = filterOptions.range.to;
              urlQuery.to = filterOptions.range.to;
            }
          }

          props.getContributions(data);

          // eslint-disable-next-line no-use-before-define
          history.push(`${location.pathname}?${makeIntoQueryParams(urlQuery)}`);
          setInitialValues(filterOptions);
        }}
        initialValues={initialValues}
      >
        {({
          formSections,
          isValid,
          handleSubmit,
          isDirty,
          /* isSubmitting */
          handleCancel,
          resetForm,
        }) => (
          <div className="nark" css={wtf}>
            {formSections.filter}
            <div css={filterControls}>
              <Button
                buttonType="submit"
                disabled={!isValid}
                onClick={handleSubmit}
              >
                Filter
              </Button>
              <a
                className="reset-button"
                disabled={isEqual(defaultValues, initialValues)}
                onClick={() => {
                  resetForm(defaultValues);
                  handleSubmit();
                }}
              >
                Reset
              </a>
            </div>
          </div>
        )}
      </FilterContributions>
    </>
  );
};

function getQueryParams(location) {
  const rawParams = location.search.replace(/^\?/, '');
  const result = {};

  rawParams.split('&').forEach(item => {
    if (item) {
      const [key, val] = item.split('=');
      result[key] = val;
    }
  });

  return result;
}

function makeIntoQueryParams(paramsObject) {
  return Object.keys(paramsObject)
    .map(param => `${param}=${paramsObject[param]}`)
    .join('&');
}

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
)(withRouter(FilterContribution));
