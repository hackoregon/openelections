import React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import Button from "../../../components/Button/Button";
import Table from "../../../components/Table";

const columnInfo = [
  {
    title: "Campaign",
    field: "name"
  },
  {
    title: "In-Kind Total",
    field: "NotSet"
  },
  {
    title: "Matched",
    field: "NotSet"
  },
  {
    title: "Email",
    field: "email"
  }
];

const ManageCampaign = ({ isCampaignListLoading, campaignList, ...props }) => {
  const isLoading = isCampaignListLoading && !(Array.isArray(campaignList));
  campaignList =[{}];

  return (
    <PageHoc>
      <h1>Manage Campaign</h1>
      <div className="manage-portal-container">
        <div className="manage-users-container">
          <div className="manage-users-table">
            <Table
              isLoading={isLoading}
              title={`Campaigns (${isLoading ? 'Loading' : campaignList.length})`}
              columns={columnInfo}
              data={isLoading ? [{}] : campaignList}
              localization={{
                body: {
                  emptyDataSourceMessage: "No Users"
                }
              }}
              options={{
                search: false,
                actionsCellStyle: {
                  color: "blue"
                },
                actionsColumnIndex: -1
              }}
              actions={[
                {
                  icon: "none", // icon is needed here or it will error.
                  name: "Manage",
                  buttonType: "manage",
                  onClick: (event, rowData) => {
                    //props.history.push({ pathname: "/manage-portal/manage-user", state: rowData });
                  }
                },
                {
                  icon: "none",
                  name: "Add New Campaign",
                  buttonType: "primary",
                  isFreeAction: true,
                  onClick: () => {
                    props.showModal({ component: "AddCampaign" });
                  }
                }
              ]}
              components={{
                Action: props => (
                  <Button
                    onClick={event => props.action.onClick(event, props.data)}
                    buttonType={props.action.buttonType}
                  >
                    {props.action.name}
                  </Button>
                )
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
