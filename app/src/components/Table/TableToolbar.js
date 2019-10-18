// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { mediaQueryRanges } from '../../assets/styles/variables';
import TablePagination from './TablePagination';

export function TableToolbar(props) {
  const { paginationOptions, action, showTitle, title } = props;
  const wrapperStyles = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    @media ${mediaQueryRanges.smallAndDown} {
      flex-direction: column-reverse;
      justify-content: center;
    }
  `;
  return (
    <div css={wrapperStyles}>
      <div>
        {showTitle && <h5>{title}</h5>}
        {paginationOptions && (
          <TablePagination
            perPage={paginationOptions.perPage || 50}
            pageNumber={paginationOptions.page}
            totalRows={paginationOptions.totalRows}
            // eslint-disable-next-line no-use-before-define
            onChangePage={paginationOptions.onChangePage}
            // eslint-disable-next-line no-use-before-define
            onChangeRowsPerPage={paginationOptions.onChangeRowsPerPage}
          />
        )}
      </div>
      <div>{action}</div>
    </div>
  );
}

TableToolbar.propTypes = {
  paginationOptions: PropTypes.oneOfType([PropTypes.object]),
  action: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  showTitle: PropTypes.bool,
  title: PropTypes.string,
};
