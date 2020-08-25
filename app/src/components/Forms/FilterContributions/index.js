/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line no-unused-vars
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
  const { status = 'all', to, from } = initialFilterOptions;

  const defaultValues = {
    status: 'all',
    range: {
      from: '',
      to: '',
    },
  };

  const initialValues = {
    status,
    range: {
      to,
      from,
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
        {({ formSections, isValid, handleSubmit }) => (
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
