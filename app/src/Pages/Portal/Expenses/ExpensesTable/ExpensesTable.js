import React, { useState } from 'react';
import { connect } from 'react-redux';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import Table from '../../../../components/Table';
import Button from '../../../../components/Button/Button';
import {
  getExpenditures,
  getExpendituresList,
  getExpendituresTotal,
} from '../../../../state/ducks/expenditures';
import {
  isCampAdmin,
  isGovAdmin,
  isLoggedIn,
} from '../../../../state/ducks/auth';
import FilterExpenses from '../../../../components/Forms/FilterExpenses';

const actionInfo = (name, buttonType, onClick, isFreeAction = undefined) =>
  isFreeAction
    ? { icon: 'none', name, buttonType, onClick, isFreeAction }
    : { icon: 'none', name, buttonType, onClick };

const columns = isGovAdmin => [
  {
    field: 'date',
    title: 'Date',
    render: rowData =>
      new Date(rowData.date)
        .toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .split(', ')[0],
  },
  {
    ...(isGovAdmin
      ? {
          field: 'campaign',
          title: 'Campaign',
          render: rowData => {
            return rowData && rowData.campaign
              ? rowData.campaign.name
              : 'Loading...';
          },
        }
      : {}),
  },
  {
    field: 'name',
    title: 'Name',
  },
  {
    field: 'amount',
    title: 'Amount',
    type: 'currency',
  },
  {
    field: 'paymentMethod',
    title: 'Payment',
  },
  {
    field: 'status',
    title: 'Status',
    render: rowData => {
      return rowData.status ? rowData.status.replace(/_/g, ' ') : '';
    },
  },
];

const ExpensesTable = ({ ...props }) => {
  const [sortFilter, setSortFilter] = useState({
    sort: {
      field: 'date',
      direction: 'DESC',
    },
  });
  const [filterOptions, setFilterOptions] = useState({});
  const [paginationOptions, setPaginationOptions] = useState({
    perPage: 50,
    page: 0,
  });

  const title = `${props.total} Expenses`;

  const isLoading =
    props.isListLoading && !Array.isArray(props.expendituresList);

  const options = {
    pageSize: paginationOptions.perPage,
    showTitle: false,
  };

  // eslint-disable-next-line no-use-before-define
  let urlQuery = getQueryParams(props.location);

  const actions = [
    actionInfo('View', 'primary', (event, rowData) => {
      props.history.push(`/expenses/${rowData.id}`);
    }),
  ];

  const components = {
    // eslint-disable-next-line react/display-name
    Action: props => (
      // <WithAdminPermissions>
      <Button
        onClick={event => props.action.onClick(event, props.data)}
        buttonType={props.action.buttonType}
      >
        {props.action.name}
      </Button>
      // </WithAdminPermissions>
    ),
  };

  return (
    <PageHoc>
      <h1>Expenses</h1>
      <FilterExpenses
        onFilterUpdate={newFilterOptions => {
          urlQuery = newFilterOptions;
          setFilterOptions(newFilterOptions);

          props.history.push(
            // eslint-disable-next-line no-use-before-define
            `${props.location.pathname}?${makeIntoQueryParams(urlQuery)}`
          );
          // eslint-disable-next-line no-use-before-define
          fetchList(newFilterOptions, sortFilter, { page: 0 });
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button
          onClick={() => {
            // eslint-disable-next-line no-use-before-define
            fetchList(filterOptions, sortFilter, { format: 'csv' });
          }}
        >
          Export
        </Button>
      </div>
      <Table
        isLoading={isLoading}
        showTitle={false}
        title={title}
        columns={columns(props.isGovAdmin)}
        options={options}
        actions={actions}
        components={components}
        data={props.expendituresList}
        pagination
        onOrderChange={(item, direction) => {
          const column = columns(props.isGovAdmin)[item];
          let sortOptions = {};
          if (column) {
            sortOptions = {
              sort: {
                field: column.field,
                direction: direction.toUpperCase(),
              },
            };
          }

          setSortFilter(sortOptions);
          // eslint-disable-next-line no-use-before-define
          fetchList(filterOptions, sortOptions, paginationOptions);
        }}
        perPage={paginationOptions.perPage}
        pageNumber={paginationOptions.page}
        totalRows={props.total}
        // eslint-disable-next-line no-use-before-define
        onChangePage={handleOnChangePage}
        // eslint-disable-next-line no-use-before-define
        onChangeRowsPerPage={handleOnRowsPerPageChange}
        toolbarAction={
          !props.isGovAdmin ? (
            <Button
              buttonType="primary"
              onClick={() => props.history.push({ pathname: '/expenses/new' })}
            >
              Add New Expense
            </Button>
          ) : null
        }
      />
    </PageHoc>
  );

  function handleOnChangePage(e, newPage) {
    const newPaginationOptions = {
      page: newPage,
      perPage: paginationOptions.perPage,
    };

    setPaginationOptions(newPaginationOptions);
    // eslint-disable-next-line no-use-before-define
    fetchList(filterOptions, sortFilter, newPaginationOptions);
  }

  function handleOnRowsPerPageChange(e) {
    const perPage = Number(e.target.value);
    const newPaginationOptions = {
      perPage,
      page: 0,
    };
    setPaginationOptions(newPaginationOptions);
    // eslint-disable-next-line no-use-before-define
    fetchList(filterOptions, sortFilter, newPaginationOptions);
  }

  function fetchList(filterOptions, sortOptions, paginationOptions) {
    const data = {
      governmentId: props.govId,
      currentUserId: props.userId,
      campaignId: props.campaignId,
      ...paginationOptions,
      ...filterOptions,
      ...sortOptions,
    };
    props.getExpenditures(data);
  }
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

export default connect(
  state => ({
    isListLoading: state.campaigns.isLoading,
    expendituresList: getExpendituresList(state),
    total: getExpendituresTotal(state),
    isGovAdmin: isGovAdmin(state),
    isCampAdmin: isCampAdmin(state),
    orgId:
      state.campaigns.currentCampaignId ||
      state.governments.currentGovernmentId,
    campaignId: state.campaigns.currentCampaignId,
    govId: state.governments.currentGovernmentId || 1,
    userId: isLoggedIn(state) ? state.auth.me.id : null,
  }),
  dispatch => {
    return {
      getExpenditures: data => dispatch(getExpenditures(data)),
    };
  }
)(ExpensesTable);
