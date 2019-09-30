import React from 'react';
import { connect } from 'react-redux';
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
    const { isListLoading, history, pastContributions } = this.props;

    const isLoading = isListLoading && !Array.isArray(pastContributions);

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
          title="Previous Contributions"
          columns={columns}
          options={{
            showTitle: false,
          }}
          actions={actions}
          components={components}
          data={pastContributions}
        />
      </PageHoc>
    );
  }
}

export default connect()(PreviousDonationsTable);
