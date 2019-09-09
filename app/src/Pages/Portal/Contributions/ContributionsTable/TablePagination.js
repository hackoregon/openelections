import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import MaterialTablePagination from '@material-ui/core/TablePagination/TablePagination';

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

const TablePagination = props => {
  const { pageNumber, totalPages, totalRows, perPage, ...rest } = props;

  return (
    <div css={paginateOptions}>
      <MaterialTablePagination
        rowsPerPageOptions={[50, 100, 150]}
        colSpan={6}
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
