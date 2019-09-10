import { css } from '@emotion/core';
import React from 'react';
import { mediaQueryRanges } from '../../assets/styles/variables';
import TablePagination from './TablePagination';

export function TableToolbar(props) {
  const {
    paginationOptions,
    totalRows,
    onChangePage,
    onRowsPerPageChange,
  } = props;

  const wrapperStyles = css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media ${mediaQueryRanges.smallAndDown} {
      flex-direction: column-reverse;
      justify-content: center;
    }
  `;
  return (
    <div css={wrapperStyles}>
      <div>
        <TablePagination
          perPage={paginationOptions.perPage || 50}
          pageNumber={paginationOptions.page}
          totalRows={totalRows}
          // eslint-disable-next-line no-use-before-define
          onChangePage={onChangePage}
          // eslint-disable-next-line no-use-before-define
          onChangeRowsPerPage={onRowsPerPageChange}
        />
      </div>
      <div>{props.action}</div>
    </div>
  );
}
