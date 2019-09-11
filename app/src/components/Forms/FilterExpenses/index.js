import React, { useState } from 'react';
import { isEqual } from 'lodash';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { withRouter } from 'react-router-dom';
import Button from '../../Button/Button';
import FilterExpensess from './FilterExpenses';

const filterOuter = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
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

const btnContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  > button {
    margin: 5px;
  }
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
  @media screen and (max-width: 900px) {
    width: 100%;
  }
`;

const FilterExpenses = props => {
  const { location, history, onFilterUpdate } = props;

  // eslint-disable-next-line no-use-before-define
  const urlQuery = getQueryParams(location);

  const defaultValues = {
    status: 'all',
    range: { to: '', from: '' },
  };

  const [initialValues, setInitialValues] = useState({
    status: urlQuery.status || 'all',
    range: {
      to: urlQuery.to || '',
      from: urlQuery.from || '',
    },
  });

  return (
    <>
      <FilterExpensess
        onSubmit={filterOptions => {
          const data = {};

          if (filterOptions.status && filterOptions.status !== 'all') {
            data.status = filterOptions.status;
          }

          if (filterOptions.range) {
            if (filterOptions.range.from) {
              data.from = filterOptions.range.from;
            }

            if (filterOptions.range.to) {
              data.to = filterOptions.range.to;
            }
          }

          onFilterUpdate(data);
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
          <div className="nark" css={filterOuter}>
            <div css={filterWrapper}>
              <div css={filterInner}>{formSections.filter}</div>
              <div css={paginateOptions}>{formSections.paginate}</div>
            </div>
            <div css={btnContainer}>
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
                  history.push(`${location.pathname}`);
                }}
              >
                Clear
              </a>
            </div>
          </div>
        )}
      </FilterExpensess>
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

// export default FilterExpenses;
export default withRouter(FilterExpenses);
