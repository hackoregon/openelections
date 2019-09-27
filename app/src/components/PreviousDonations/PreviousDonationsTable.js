import React from 'react';
import { connect } from 'react-redux';
import PageHoc from '../PageHoc/PageHoc';
import Table from '../Table';
import Button from '../Button/Button';
import {
  getContributionsList,
  getContributionsTotal,
  getFilterOptions,
  updateFilter,
} from '../../state/ducks/contributions';
import { isCampAdmin, isGovAdmin, isLoggedIn } from '../../state/ducks/auth';
import pastContributions from '../../state/ducks/pastContributions';

const actionInfo = (name, buttonType, onClick, isFreeAction = undefined) =>
  isFreeAction
    ? { icon: 'none', name, buttonType, onClick, isFreeAction }
    : { icon: 'none', name, buttonType, onClick };

const columns = isGovAdmin => [
  {
    field: 'name',
    title: 'Name',
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
    field: 'amount',
    title: 'Amount',
    type: 'currency',
  },
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
];

class PreviousDonationsTable extends React.Component {
  constructor(props) {
    super(props);
    props.pastContributions({
      matchId: props.matchId,
    });
  }

  render() {
    const {
      pastContributions,
      isListLoading,
      contributionsList,
      history,
      total,
      isGovAdmin,
      matchId,
    } = this.props;

    console.log({ pastContributions });
    const isLoading = isListLoading && !Array.isArray(contributionsList);

    const actions = [
      actionInfo('View', 'primary', (event, rowData) => {
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

    return (
      <PageHoc>
        <Table
          isLoading={isLoading}
          showTitle={false}
          title={`${total} Previous Contributions`}
          columns={columns(isGovAdmin)}
          options={{
            showTitle: false,
          }}
          actions={actions}
          components={components}
          data={contributionsList}
          totalRows={total}
        />
      </PageHoc>
    );
  }
}

export default connect(
  state => ({
    filterOptions: getFilterOptions(state),
    isListLoading: state.campaigns.isLoading,
    contributionsList: getContributionsList(state),
    total: getContributionsTotal(state),
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
      pastContributions: matchId => dispatch(pastContributions(matchId)),
    };
  }
)(PreviousDonationsTable);
