import React from 'react';
import PropTypes from 'prop-types';
import PageHoc from '../../../components/PageHoc/PageHoc';
import Button from '../../../components/Button/Button';
import Table from '../../../components/Table';

const columnInfo = [
  {
    title: 'Campaign',
    field: 'name',
    editable: 'onUpdate',
  },
  {
    title: 'In-Kind Total',
    field: 'NotSet',
    editable: 'never',
  },
  {
    title: 'Matched',
    field: 'NotSet',
    editable: 'never',
  },
  {
    title: 'Contact Email',
    field: 'email',
    editable: 'never',
  },
];

const ManageCampaign = ({
  isCampaignListLoading,
  campaignList,
  showModal,
  updateCampaignName,
}) => {
  const isLoading = isCampaignListLoading && !Array.isArray(campaignList);
  const rowCount = Array.isArray(campaignList) ? campaignList.length : 0;

  const [campaignData, setCampaignData] = React.useState(campaignList);
  React.useEffect(() => {
    setCampaignData(campaignList);
  }, [campaignList]);

  const updateNameOfCampaign = async (newData, oldData) => {
    return new Promise((resolve, reject) => {
      if (newData.name !== oldData.name) {
        updateCampaignName(newData.governmentId, newData.id, newData.name);
        const newCampaignArray = campaignData.map(campaign => {
          if (campaign.id === newData.id) {
            campaign.name = newData.name;
          }
          return campaign;
        });
        setCampaignData(newCampaignArray);
        resolve();
      } else {
        reject();
      }
    });
  };

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
              data={campaignData || [{}]}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  updateNameOfCampaign(newData, oldData),
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No Users',
                },
              }}
              options={{
                search: false,
                actionsCellStyle: {
                  color: 'black',
                },
                actionsColumnIndex: 0,
              }}
              toolbarAction={
                <Button
                  buttonType="primary"
                  onClick={() => showModal({ component: 'AddCampaign' })}
                >
                  Add New Campaign
                </Button>
              }
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
  updateCampaignName: PropTypes.func,
};
