import React from 'react';
import { connect } from 'react-redux';
import { parseFromTimeZone } from 'date-fns-timezone';
import { format } from 'date-fns';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import FilterContribution from '../../../../components/Forms/FilterContributions/index';
import Table from '../../../../components/Table';
import Button from '../../../../components/Button/Button';
import {
  getContributionsList,
  getContributionsTotal,
} from '../../../../state/ducks/contributions';
import { isCampAdmin, isGovAdmin } from '../../../../state/ducks/auth';

const columnInfo = (title, field, type = undefined) =>
  type ? { title, field, type } : { title, field };

const actionInfo = (name, buttonType, onClick, isFreeAction = undefined) =>
  isFreeAction
    ? { icon: 'none', name, buttonType, onClick, isFreeAction }
    : { icon: 'none', name, buttonType, onClick };

const columns = isGovAdmin => [
  {
    field: 'date',
    title: 'Date',
    render: rowData =>
      format(
        new Date(
          parseFromTimeZone(rowData.date, { timeZone: 'America/Los_Angeles' })
        ),
        'MM-DD-YYYY'
      ),
  },
  {
    ...(isGovAdmin
      ? {
          field: 'campaign',
          title: 'Campaign',
          render: rowData => {
            return rowData.campaign.name;
          },
        }
      : {}),
  },
  {
    field: 'name',
    title: 'Name',
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
    field: 'name',
    title: 'Name',
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
  columnInfo('Amount', 'amount', 'currency'),
  columnInfo('Status', 'status'),
  // columnInfo("Labels", "NotSet")
];

const ContributionsTable = ({ ...props }) => {
  const isLoading =
    props.isListLoading && !Array.isArray(props.contributionList);
  const title = `${props.total} Contributions`;
  const options = {
    search: false,
    actionCellStyle: {
      color: 'blue',
    },
    actionsColumnIndex: -1,
    pageSizeOptions: [20, 50, 100],
    pageSize: 50,
  };
  const actions = [
    actionInfo('View', 'primary', (event, rowData) => {
      props.history.push(`/contributions/${rowData.id}`);
    }),
  ];
  // Only campaign admins can create contributions
  if (props.isCampAdmin) {
    actions.push(
      actionInfo(
        'Add New Contribution',
        'primary',
        () => props.history.push({ pathname: '/contributions/add' }),
        true
      )
    );
  }
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
      <h1>Contributions</h1>
      <FilterContribution />
      <Table
        isLoading={isLoading}
        title={title}
        columns={columns(props.isGovAdmin)}
        options={options}
        actions={actions}
        components={components}
        data={props.contributionList}
      />
    </PageHoc>
  );
};

export default connect(state => ({
  isCampAdmin: isCampAdmin(state),
  isGovAdmin: isGovAdmin(state),
  isListLoading: state.campaigns.isLoading,
  contributionList: getContributionsList(state),
  total: getContributionsTotal(state),
}))(ContributionsTable);
