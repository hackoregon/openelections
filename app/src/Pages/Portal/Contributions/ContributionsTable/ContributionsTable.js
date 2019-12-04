import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parseFromTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import FilterContribution from '../../../../components/Forms/FilterContributions/index';
import Table from '../../../../components/Table';
import Button from '../../../../components/Button/Button';
import {
  getContributions,
  getContributionsList,
  getFilterOptions,
  updateFilter,
} from '../../../../state/ducks/contributions';
import {
  isCampAdmin,
  isGovAdmin,
  getCurrentUserId,
} from '../../../../state/ducks/auth';
import { showModal } from '../../../../state/ducks/modal';

// Need History push to URL?
// Need Create sort for updatedOn date field?

const actionInfo = (name, buttonType, onClick, isFreeAction = undefined) =>
  isFreeAction
    ? { icon: 'none', name, buttonType, onClick, isFreeAction }
    : { icon: 'none', name, buttonType, onClick };

const columns = isGovAdmin => {
  const cols = [
    {
      field: 'date',
      title: 'Contribution Date',
      render: rowData =>
        format(
          new Date(
            parseFromTimeZone(rowData.date, { timeZone: 'America/Los_Angeles' })
          ),
          'MM-DD-YYYY'
        ),
    },
    {
      field: 'name',
      title: 'Name',
      sorting: false,
      render: rowData => {
        if (
          rowData.contributorType === 'individual' ||
          rowData.contributorType === 'family'
        ) {
          return `${rowData.firstName} ${rowData.lastName}`;
        }
        return rowData.name;
      },
    },
    {
      field: 'oaeType',
      title: 'OAE Type',
      render: rowData => {
        return rowData.oaeType
          ? (
              rowData.oaeType[0].toUpperCase() + rowData.oaeType.slice(1)
            ).replace(/_/g, ' ')
          : '';
      },
    },
    {
      field: 'amount',
      title: 'Contribution Amount',
      sorting: false,
      type: 'currency',
    },
    {
      field: 'status',
      title: 'Status',
    },
    {
      field: 'matchAmount', // currentContribution.matchAmount
      title: 'Match',
      render: rowData => {
        return rowData.matchAmount ? `$${rowData.matchAmount}` : '';
      },
    },
  ];

  if (isGovAdmin)
    cols.splice(1, 0, {
      field: 'campaign',
      title: 'Campaign',
      sorting: false,
      render: rowData => {
        return rowData && rowData.campaign
          ? rowData.campaign.name
          : 'Loading...';
      },
    });

  return cols;
};

class ContributionsTable extends React.Component {
  constructor(props) {
    super(props);
    props.getContributions({
      governmentId: props.govId,
      currentUserId: props.userId,
      campaignId: props.campaignId,
    });
  }

  render() {
    const {
      getContributions,
      getAllContributions,
      filterOptions,
      updateFilter,
      isListLoading,
      contributionList,
      history,
      total,
      govId,
      userId,
      campaignId,
      isGovAdmin,
    } = this.props;

    const isLoading = isListLoading && !Array.isArray(contributionList);

    const actions = [
      actionInfo('View', 'submit', (event, rowData) => {
        history.push(`/contributions/${rowData.id}`);
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
      getContributions(data);
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
        getAllContributions(data);
      } else {
        getContributions(data);
      }
    }

    function fetchList() {
      getContributions({
        governmentId: govId,
        currentUserId: userId,
        campaignId,
        // ...filter,
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
        <h1>Contributions</h1>
        <FilterContribution
          onFilterUpdate={newFilterOptions => {
            // Filter button has been pressed
            const reset = { status: 'all', to: '', from: '', page: 0 };
            updateFilter(reset);
            updateFilter(newFilterOptions);
            fetchList();
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            onClick={() => {
              fetchCSV();
            }}
          >
            Export
          </Button>
          <Button
            onClick={() => {
              // fetchXML();
              this.props.showModal({
                component: 'ExportXML',
                props: {
                  fetch: (isAll, filerId) => fetchXML(isAll, filerId),
                },
              });
            }}
          >
            Export XML
          </Button>
        </div>
        <Table
          isLoading={isLoading}
          title={`${total} Contributions`}
          columns={columns(isGovAdmin)}
          options={{
            pageSize: filterOptions.perPage || 50,
            showTitle: false,
          }}
          actions={actions}
          components={components}
          data={contributionList}
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
          perPage={filterOptions.perPage || 50}
          pageNumber={filterOptions.page || 0}
          totalRows={total}
          onChangePage={handleOnChangePage}
          // eslint-disable-next-line no-use-before-define
          onChangeRowsPerPage={handleOnRowsPerPageChange}
          toolbarAction={
            !isGovAdmin ? (
              <Button
                buttonType="green"
                onClick={() => history.push({ pathname: '/contributions/add' })}
              >
                Add New Contribution
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
    isCampAdmin: isCampAdmin(state),
    isGovAdmin: isGovAdmin(state),
    isListLoading: state.campaigns.isLoading,
    contributionList: getContributionsList(state),
    orgId:
      state.campaigns.currentCampaignId ||
      state.governments.currentGovernmentId,
    campaignId: state.campaigns.currentCampaignId,
    govId: state.governments.currentGovernmentId || 1,
    userId: getCurrentUserId(state),
    total: state.contributions.total,
  }),
  dispatch => {
    return {
      getContributions: data => dispatch(getContributions(data, true)),
      getAllContributions: data => dispatch(getContributions(data, false)),
      updateFilter: filterOptions => dispatch(updateFilter(filterOptions)),
      showModal: payload => {
        dispatch(showModal(payload));
      },
    };
  }
)(ContributionsTable);

ContributionsTable.propTypes = {
  getContributions: PropTypes.func,
  filterOptions: PropTypes.oneOfType([PropTypes.object]),
  updateFilter: PropTypes.func,
  isListLoading: PropTypes.bool,
  contributionList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  history: PropTypes.oneOfType([PropTypes.object]),
  total: PropTypes.number,
  govId: PropTypes.number,
  userId: PropTypes.number,
  campaignId: PropTypes.number,
  isGovAdmin: PropTypes.bool,
};
