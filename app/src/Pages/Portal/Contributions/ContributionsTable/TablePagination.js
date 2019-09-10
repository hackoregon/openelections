import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import MaterialTablePagination from '@material-ui/core/TablePagination/TablePagination';

const paginateOptions = css`
  .MuiToolbar-root,
  .MuiTablePagination-root {
    padding-left: 0;
    border-bottom: none;
  }

  .MuiTablePagination-caption,
  .MuiTablePagination-selectRoot {
    font-size: 14px;
  }
`;

const TablePagination = props => {
  const { pageNumber, totalPages, totalRows, perPage, ...rest } = props;

  return (
    <div css={paginateOptions}>
      <MaterialTablePagination
        rowsPerPageOptions={[50, 100, 150]}
        count={totalRows}
        rowsPerPage={perPage || 50}
        page={pageNumber}
        SelectProps={{
          inputProps: { 'aria-label': 'rows per page' },
          native: true,
        }}
        {...rest}
      />
    </div>
  );
};

export default TablePagination;
