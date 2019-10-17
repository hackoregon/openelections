import React from 'react';
import PropTypes from 'prop-types';
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
const Action = ({ action, data }) => (
  <Button
    onClick={event => action.onClick(event, data)}
    buttonType={action.buttonType}
  >
    {action.name}
  </Button>
);

const ManageCampaign = ({ isCampaignListLoading, campaignList, showModal }) => {
  const isLoading = isCampaignListLoading && !Array.isArray(campaignList);
  const rowCount = Array.isArray(campaignList) ? campaignList.length : 0;
  return (
    <PageHoc>
      <h1>Settings</h1>
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
                  onClick={() => showModal({ component: 'AddCampaign' })}
                >
                  Add New Campaign
                </Button>
              }
              // actions={[
              //   {
              //     icon: 'none', // icon is needed here or it will error.
              //     name: 'Manage',
              //     buttonType: 'manage',
              //     onClick: (event, rowData) => {
              //       props.history.push({
              //         pathname: '/settings/manage-user',
              //         state: rowData,
              //       });
              //     },
              //   },
              // ]}
              components={{
                // eslint-disable-next-line react/display-name
                Action,
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

ManageCampaign.propTypes = {
  isCampaignListLoading: PropTypes.bool,
  campaignList: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  showModal: PropTypes.func,
};

Action.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]),
  action: PropTypes.oneOfType([PropTypes.object]),
};
