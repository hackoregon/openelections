import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
  TablePagination as MaterialTablePagination,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  ChevronRight as NextPageIcon,
  ChevronLeft as PreviousPageIcon,
  KeyboardArrowRight,
  KeyboardArrowLeft,
} from '@material-ui/icons';

const paginateOptions = css`
  .MuiTablePagination-root {
    display: inline-block;
  }

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

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onChangePage } = props;

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
  }

  function handleLastPageButtonClick(event) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }

  return (
    <div style={{ flexShrink: 0 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

const TablePagination = props => {
  const { pageNumber, totalRows, perPage, ...rest } = props;

  return (
    <div css={paginateOptions}>
      <MaterialTablePagination
        labelDisplayedRows={row => {
          return `${row.from} - ${row.to} of ${totalRows}`;
        }}
        rowsPerPageOptions={[50, 100, 150]}
        count={totalRows}
        rowsPerPage={perPage || 50}
        page={pageNumber}
        SelectProps={{
          renderValue: value => (
            <div style={{ padding: '0px 5px' }}>{value} rows</div>
          ),
        }}
        labelRowsPerPage=""
        ActionsComponent={TablePaginationActions}
        component="div"
        {...rest}
      />
    </div>
  );
};

export default TablePagination;
