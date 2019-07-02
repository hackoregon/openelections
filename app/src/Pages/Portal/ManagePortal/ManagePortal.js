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
const seedUsers = [
  {
    fname: "Jonathon",
    lname: "LastName",
    title: "Treasurer",
    email: "jonlast@fakeemail.com",
    role: "Admin"
  }
];
const ManagePortalPage = props => (
  <PageHoc>
    <h1>Manage Campaign Portal</h1>
    <div className="manage-portal-container">
      <div className="manage-users-container">
        <div className="manage-users-table">
          <Table
            title="Users"
            columns={columnInfo}
            data={seedUsers}
            options={{
              search: false,
              actionsCellStyle: {},
              actionsColumnIndex: -1
            }}
            actions={[
              {
                icon: props => <Button buttonType="manage">Manage</Button>,
                tooltip: "Manage User",
                onClick: (event, rowData) =>
                  console.log("You are editing " + rowData.fname)
              }
            ]}
            components={{
              Actions: props => (
                <Button
                  onClick={(event, rowData) =>
                    console.log("add user", rowData, props)
                  }
                >
                  Add New User
                </Button>
              ),
              // Action: props => (
              //   <Button
              //     onClick={(event, rowData) =>
              //       console.log("add user", rowData, props)
              //     }
              //   >
              //     manage
              //   </Button>
              // )
            }}
          />
        </div>
      </div>
      <div className="manage-labels" />
    </div>
  </PageHoc>
);
export default ManagePortalPage;
