import React from 'react';
import PropTypes from 'prop-types';
import PageHoc from '../PageHoc/PageHoc';
import Table from '../Table';
import Button from '../Button/Button';

const actionInfo = (name, buttonType, onClick, isFreeAction = undefined) =>
  isFreeAction
    ? { icon: 'none', name, buttonType, onClick, isFreeAction }
    : { icon: 'none', name, buttonType, onClick };

const columns = [
  {
    field: 'name',
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
    field: 'campaign',
    render: rowData => {
      return rowData && rowData.campaign ? rowData.campaign.name : 'Loading...';
    },
  },
  {
    field: 'amount',
    type: 'currency',
  },
  {
    field: 'date',
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
  render() {
    const { history, pastContributions, matchId, currentId } = this.props;

    const actions = [
      actionInfo('View', 'tableButton', (event, rowData) => {
        rowData.id === currentId
          ? alert('You are already viewing this contribution record')
          : history.push(`/contributions/${rowData.id}`);
      }),
    ];

    const components = {
      // eslint-disable-next-line react/display-name
      Action: props => (
        <Button
          onClick={event => props.action.onClick(event, props.data)}
          buttonType={props.action.buttonType}
          disabled={!!(props.data.id === currentId)}
        >
          {props.data.id === currentId ? 'Current' : props.action.name}
        </Button>
      ),
    };

    return (
      <PageHoc>
        {matchId === null ? (
          <div>
            <h5>Previous Donations</h5>
            <p>No previous donations found</p>
          </div>
        ) : (
          <Table
            showTitle
            title="Previous Donations"
            columns={columns}
            actions={actions}
            components={components}
            data={pastContributions}
          />
        )}
      </PageHoc>
    );
  }
}

export default PreviousDonationsTable;

PreviousDonationsTable.propTypes = {
  history: PropTypes.oneOfType([PropTypes.object]),
  pastContributions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  matchId: PropTypes.string,
  currentId: PropTypes.number,
};
