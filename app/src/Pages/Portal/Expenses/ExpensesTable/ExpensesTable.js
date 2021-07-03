import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import Table from '../../../../components/Table';
import Button from '../../../../components/Button/Button';
import {
  bulkUpdateExpenditures,
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
import { showModal } from '../../../../state/ducks/modal';

const buttonStyles = css`
  margin: 0 5px !important;
`;

const buttonWrapper = css`
  display: flex;
  flex-direction: row-reverse;
  @media screen and (max-width: 900px) {
    margin-top: 10px;
    justify-content: center;
  }
`;

const actionInfo = (name, buttonType, onClick, isFreeAction = undefined) =>
  isFreeAction
    ? { icon: 'none', name, buttonType, onClick, isFreeAction }
    : { icon: 'none', name, buttonType, onClick, position: 'row' };

const columns = isGovAdmin => [
  {
    field: 'date',
    title: 'Expenditure Date',
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
    title: 'Date Submitted',
    render: rowData =>
      new Date(rowData.createdAt)
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
          field: 'campaignId',
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
    sorting: false,
  },
  {
    field: 'amount',
    title: 'Amount',
    type: 'currency',
    sorting: false,
  },
  {
    field: 'paymentMethod',
    title: 'Payment',
    render: rowData => {
      return rowData.paymentMethod
        ? rowData.paymentMethod.replace(/_/g, ' ')
        : '';
    },
    sorting: false,
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
    this.state = {
      itemsToSubmit: null,
      bulkSubmitted: false,
    };
    props.getExpenditures({
      governmentId: props.govId,
      currentUserId: props.userId,
      campaignId: props.campaignId,
    });
    this.updateItemsToSubmit = this.updateItemsToSubmit.bind(this);
  }

  updateItemsToSubmit(items) {
    if (items.length > 0) {
      this.setState({
        itemsToSubmit: items,
      });
    } else {
      this.setState({
        itemsToSubmit: null,
      });
    }
  }

  render() {
    const {
      getExpenditures,
      getAllExpenditures,
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
      bulkSubmitExpenditures,
    } = this.props;

    const isLoading = isListLoading && !Array.isArray(expendituresList);

    const actions = [
      actionInfo(
        'View',
        'submit',
        (event, rowData) => {
          history.push(`/expenses/${rowData.id}`);
        },
        false
      ),
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

    function fetchXML(isAll, filerId) {
      const data = {
        governmentId: govId,
        currentUserId: userId,
        campaignId,
        format: 'xml',
        filerId,
      };
      if (isAll) {
        getAllExpenditures(data);
      } else {
        getExpenditures(data);
      }
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
        <div css={buttonWrapper}>
          <div css={buttonStyles}>
            <Button
              onClick={() => {
                fetchCSV();
              }}
            >
              Export CSV
            </Button>
          </div>
          <div css={buttonStyles}>
            <Button
              css={buttonStyles}
              onClick={() => {
                this.props.showModal({
                  component: 'ExportXML',
                  props: {
                    fetch: (isAll, filerId) => fetchXML(isAll, filerId),
                    totalFiltered: filterOptions.perPage || 50,
                    total,
                  },
                });
              }}
            >
              Export XML
            </Button>
          </div>
        </div>
        <Table
          isLoading={isLoading}
          showTitle={false}
          title={`${total} Expenses`}
          columns={columns(isGovAdmin)}
          options={{
            pageSize: filterOptions.perPage || 50,
            showTitle: false,
            actionsColumnIndex: -1,
            selection: true,
            selectionProps: rowData => {
              return {
                disabled: rowData.status === 'Submitted',
                color: 'primary',
              };
            },
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
          onChangePage={handleOnChangePage}
          onChangeRowsPerPage={handleOnRowsPerPageChange}
          toolbarAction={
            !isGovAdmin ? (
              <>
                <Button
                  buttonType="green"
                  onClick={() => history.push({ pathname: '/expenses/new' })}
                >
                  Add New Expense
                </Button>
                {this.state.itemsToSubmit && (
                  <Button
                    buttonType="green"
                    onClick={() => {
                      bulkSubmitExpenditures(this.state.itemsToSubmit);
                      this.setState({
                        itemsToSubmit: null,
                        bulkSubmitted: true,
                      });
                    }}
                  >
                    Bulk Submit
                  </Button>
                )}
                {this.state.bulkSubmitted && (
                  <Button
                    buttonType="green"
                    onClick={() => {
                      fetchList();
                      this.setState({
                        itemsToSubmit: null,
                        bulkSubmitted: false,
                      });
                    }}
                  >
                    Refresh
                  </Button>
                )}
              </>
            ) : null
          }
          onSelectionChange={items => this.updateItemsToSubmit(items)}
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
      getAllExpenditures: data => dispatch(getExpenditures(data, false)),
      showModal: payload => {
        dispatch(showModal(payload));
      },
      bulkSubmitExpenditures: data => dispatch(bulkUpdateExpenditures(data)),
    };
  }
)(ExpensesTable);

ExpensesTable.propTypes = {
  getExpenditures: PropTypes.func,
  filterOptions: PropTypes.PropTypes.oneOfType([PropTypes.object]),
  updateFilter: PropTypes.func,
  isListLoading: PropTypes.bool,
  expendituresList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  history: PropTypes.PropTypes.oneOfType([PropTypes.object]),
  total: PropTypes.number,
  govId: PropTypes.number,
  userId: PropTypes.number,
  campaignId: PropTypes.number,
  isGovAdmin: PropTypes.bool,
  bulkSubmitExpenditures: PropTypes.func,
};
