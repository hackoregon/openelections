import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parseFromTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import FilterContribution from '../../../../components/Forms/FilterContributions/index';
import Table from '../../../../components/Table';
import Button from '../../../../components/Button/Button';
import {
  bulkUpdateContributions,
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
      field: 'campaignId',
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
    this.state = {
      itemsToSubmit: null,
      bulkSubmitted: false,
    };
    props.getContributions({
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
      bulkSubmitContributions,
    } = this.props;

    const isLoading = isListLoading && !Array.isArray(contributionList);

    const actions = [
      actionInfo(
        'View',
        'submit',
        (event, rowData) => {
          history.push(`/contributions/${rowData.id}`);
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
                // fetchXML();
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
          title={`${total} Contributions`}
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
          onChangeRowsPerPage={handleOnRowsPerPageChange}
          toolbarAction={
            !isGovAdmin ? (
              <>
                <Button
                  buttonType="green"
                  onClick={() =>
                    history.push({ pathname: '/contributions/add' })
                  }
                >
                  Add New Contribution
                </Button>
                {this.state.itemsToSubmit && (
                  <Button
                    buttonType="green"
                    onClick={() => {
                      bulkSubmitContributions(this.state.itemsToSubmit);
                      this.setState({
                        itemsToSubmit: null,
                        bulkSubmitted: true,
                      });
                    }}
                  >
                    bulk submit
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
      bulkSubmitContributions: data => dispatch(bulkUpdateContributions(data)),
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
