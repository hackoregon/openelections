import React from 'react';
import { connect } from 'react-redux';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import Table from '../../../../components/Table';
import Button from '../../../../components/Button/Button';
import {
  getExpenditures,
  getExpendituresList,
  getExpendituresTotal,
  getFilterOptions,
  updateFilter,
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
    render: rowData => {
      return rowData.paymentMethod
        ? rowData.paymentMethod.replace(/_/g, ' ')
        : '';
    },
  },
  {
    field: 'status',
    title: 'Status',
    render: rowData => {
      return rowData.status ? rowData.status.replace(/_/g, ' ') : '';
    },
  },
];

class ExpensesTable extends React.Component {
  constructor(props) {
    super(props);
    props.getExpenditures({
      governmentId: props.govId,
      currentUserId: props.userId,
      campaignId: props.campaignId,
    });
  }

  render() {
    const {
      getExpenditures,
      filterOptions,
      updateFilter,
      isListLoading,
      expendituresList,
      history,
      total,
      govId,
      userId,
      campaignId,
      isGovAdmin,
    } = this.props;

    const isLoading = isListLoading && !Array.isArray(expendituresList);

    const actions = [
      actionInfo('View', 'submit', (event, rowData) => {
        history.push(`/expenses/${rowData.id}`);
      }),
    ];

    const components = {
      // eslint-disable-next-line react/display-name
      Action: props => (
        <Button
          onClick={event => props.action.onClick(event, props.data)}
          buttonType={props.action.buttonType}
        >
          {props.action.name}
        </Button>
      ),
    };
    function fetchCSV() {
      const data = {
        governmentId: govId,
        currentUserId: userId,
        campaignId,
        format: 'csv',
      };
      getExpenditures(data);
    }
    function fetchList() {
      getExpenditures({
        governmentId: govId,
        currentUserId: userId,
        campaignId,
      });
    }
    function handleOnChangePage(e, newPage) {
      updateFilter({ page: newPage });
      fetchList();
    }

    function handleOnRowsPerPageChange(e) {
      const perPage = Number(e.target.value);
      updateFilter({ perPage });
      fetchList();
    }

    return (
      <PageHoc>
        <h1>Expenses</h1>
        <FilterExpenses
          onFilterUpdate={newFilterOptions => {
            // Filter button has been pressed
            const reset = { status: 'all', to: '', from: '', page: 0 };
            updateFilter(reset);
            updateFilter(newFilterOptions);
            fetchList();
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
          }}
        >
          <Button
            onClick={() => {
              fetchCSV();
            }}
          >
            Export
          </Button>
        </div>
        <Table
          isLoading={isLoading}
          showTitle={false}
          title={`${total} Expenses`}
          columns={columns(isGovAdmin)}
          options={{
            pageSize: filterOptions.perPage || 50,
            showTitle: false,
          }}
          actions={actions}
          components={components}
          data={expendituresList}
          onOrderChange={(item, direction) => {
            const column = columns(isGovAdmin)[item];
            let sortOptions = {};
            if (column) {
              sortOptions = {
                sort: {
                  field: column.field,
                  direction: direction.toUpperCase(),
                },
              };
            }

            updateFilter(sortOptions);
            fetchList();
          }}
          perPage={filterOptions.perPage}
          pageNumber={filterOptions.page}
          totalRows={total}
          // eslint-disable-next-line no-use-before-define
          onChangePage={handleOnChangePage}
          // eslint-disable-next-line no-use-before-define
          onChangeRowsPerPage={handleOnRowsPerPageChange}
          toolbarAction={
            !isGovAdmin ? (
              <Button
                buttonType="green"
                onClick={() => history.push({ pathname: '/expenses/new' })}
              >
                Add New Expense
              </Button>
            ) : null
          }
        />
      </PageHoc>
    );
  }
}

export default connect(
  state => ({
    filterOptions: getFilterOptions(state),
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
      getFilterOptions,
      updateFilter: filterOptions => dispatch(updateFilter(filterOptions)),
      getExpenditures: data => dispatch(getExpenditures(data, true)),
    };
  }
)(ExpensesTable);
