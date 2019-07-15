import React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import Button from "../../../components/Button/Button";
import Table from "../../../components/Table";

const columnInfo = [
  {
    title: "First Name",
    field: "fname"
  },
  {
    title: "Last Name",
    field: "lname"
  },
  {
    title: "Title",
    field: "title"
  },
  {
    title: "Email",
    field: "email"
  },
  {
    title: "Role",
    field: "role"
  }
];

const ManagePortalPage = props => (
  <PageHoc>
    <h1>Manage Campaign Portal</h1>
    <div className="manage-portal-container">
      <div className="manage-users-container">
        <div className="manage-users-table">
          <Table
            title={`Users (${props.userList.length})`}
            columns={columnInfo}
            data={props.userList}
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
                  props.history.push({ pathname: "/manage-portal/manage-user", state: rowData });
                }
              },
              {
                icon: "none",
                name: "Add New User",
                buttonType: "primary",
                isFreeAction: true,
                onClick: (event, rowData) => {
                  console.log({ event, rowData })
                  props.showModal({ component: "AddUser" });
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
export default ManagePortalPage;
