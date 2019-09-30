/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import Button from '../../Button/Button';
import FilterContributions from './FilterContributions';
import {
  getFilterOptions,
  initialState,
  updateFilter,
} from '../../../state/ducks/contributions';
import {
  paginateOptions,
  filterInner,
  filterWrapper,
  filterOuter,
  btnContainer,
} from '../../../assets/styles/filter.styles';

const FilterContribution = props => {
  const { updateFilter, onFilterUpdate, initialFilterOptions } = props;
  const defaultValues = initialState.listFilterOptions;
  const initialValues = {
    status: initialFilterOptions.status || 'all',
    range: {
      to: initialFilterOptions.to || '',
      from: initialFilterOptions.from || '',
    },
  };

  return (
    <>
      <FilterContributions
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
        }}
        initialValues={initialValues}
      >
        {({ formSections, isValid, handleSubmit, resetForm }) => (
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
                  handleSubmit();
                  updateFilter({
                    from: '',
                    to: '',
                    status: 'all',
                    page: 0,
                  });
                }}
              >
                Clear
              </a>
            </div>
          </div>
        )}
      </FilterContributions>
    </>
  );
};

FilterContribution.propTypes = {
  initialFilterOptions: PropTypes.shape({}),
  updateFilter: PropTypes.func,
  onFilterUpdate: PropTypes.func,
};

export default connect(
  state => ({
    initialFilterOptions: getFilterOptions(state),
  }),
  dispatch => {
    return {
      updateFilter: filter => dispatch(updateFilter(filter)),
    };
  }
)(FilterContribution);
