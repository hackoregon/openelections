import React from 'react';
import PageHoc from '../../../components/PageHoc/PageHoc';
import Button from '../../../components/Button/Button';
import Table from '../../../components/Table';

const columnInfo = [
  {
    title: 'Campaign',
    field: 'name',
  },
  {
    title: 'In-Kind Total',
    field: 'NotSet',
  },
  {
    title: 'Matched',
    field: 'NotSet',
  },
  {
    title: 'Contact Email',
    field: 'email',
  },
];

const ManageCampaign = ({ isCampaignListLoading, campaignList, ...props }) => {
  const isLoading = isCampaignListLoading && !Array.isArray(campaignList);
  const rowCount = Array.isArray(campaignList) ? campaignList.length : 0;
  return (
    <PageHoc>
      <h1>Manage Campaign</h1>
      <div className="manage-portal-container">
        <div className="manage-users-container">
          <div className="manage-users-table">
            <Table
              isLoading={isLoading}
              title={`Campaigns (${rowCount})`}
              columns={columnInfo}
              data={campaignList || [{}]}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No Users',
                },
              }}
              options={{
                search: false,
                actionsCellStyle: {
                  color: 'blue',
                },
                actionsColumnIndex: -1,
              }}
              toolbarAction={
                <Button
                  buttonType="primary"
                  onClick={() => props.showModal({ component: 'AddCampaign' })}
                >
                  Add New Expense
                </Button>
              }
              actions={[
                {
                  icon: 'none', // icon is needed here or it will error.
                  name: 'Manage',
                  buttonType: 'manage',
                  onClick: (event, rowData) => {
                    props.history.push({
                      pathname: '/manage-portal/manage-user',
                      state: rowData,
                    });
                  },
                },
              ]}
              components={{
                Action: props => (
                  <Button
                    onClick={event => props.action.onClick(event, props.data)}
                    buttonType={props.action.buttonType}
                  >
                    {props.action.name}
                  </Button>
                ),
              }}
            />
          </div>
        </div>
        <div className="manage-labels" />
      </div>
    </PageHoc>
  );
};
export default ManageCampaign;
