/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/display-name */
// Documentaiton for this component can be found at: https://material-table.com
// eslint-disable-next-line
import React, { forwardRef } from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import TablePagination from './TablePagination';
import { TableToolbar } from './TableToolbar';
import { PageTransition } from '../PageTransistion';

const tableWrapper = css`
  width: 100%;
  .MuiPaper-root {
    box-shadow: none;
  }
  font-size: 0.875rem;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: 0.01071em;
`;

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const tableOptions = {
  search: false,
  draggable: false,
  actionCellStyle: {
    color: 'blue',
  },
  actionsColumnIndex: -1,
  paging: false,
};

const Table = ({
  title,
  columns,
  data,
  editable,
  options,
  actions,
  components,
  localization,
  isLoading,
  perPage,
  pageNumber,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  toolbarAction,
  ...rest
}) => {
  const enableCustomPagination = Boolean(
    perPage !== undefined &&
      pageNumber !== undefined &&
      totalRows !== undefined &&
      onPageChange !== undefined &&
      onRowsPerPageChange !== undefined
  );

  return (
    <PageTransition>
      <div css={tableWrapper}>
        <MaterialTable
          title={title}
          columns={columns}
          data={data}
          editable={editable}
          icons={tableIcons}
          options={{
            ...tableOptions,
            ...options,
            paging:
              options && Object.prototype.hasOwnProperty.call(options, 'paging')
                ? options.paging
                : !enableCustomPagination,
          }}
          actions={actions}
          components={{
            Toolbar: toolBarProps => (
              <TableToolbar
                paginationOptions={
                  enableCustomPagination
                    ? {
                        page: pageNumber,
                        perPage,
                        totalRows,
                        onPageChange,
                        onRowsPerPageChange,
                      }
                    : undefined
                }
                action={toolbarAction}
                {...toolBarProps}
              />
            ),
            ...components,
          }}
          localization={localization}
          isLoading={isLoading}
          {...rest}
        />
        {enableCustomPagination && (
          <TablePagination
            perPage={perPage}
            pageNumber={pageNumber}
            totalRows={totalRows || data.length}
            // eslint-disable-next-line no-use-before-define
            onPageChange={onPageChange}
            // eslint-disable-next-line no-use-before-define
            onRowsPerPageChange={onRowsPerPageChange}
          />
        )}
      </div>
    </PageTransition>
  );
};

Table.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.any,
  editable: PropTypes.object,
  options: PropTypes.object,
  actions: PropTypes.array,
  components: PropTypes.object,
  localization: PropTypes.object,
  isLoading: PropTypes.bool,
  perPage: PropTypes.number,
  pageNumber: PropTypes.number,
  totalRows: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  toolbarAction: PropTypes.any,
};

export default Table;
