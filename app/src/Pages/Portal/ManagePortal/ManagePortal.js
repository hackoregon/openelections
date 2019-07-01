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
    lname: "Servos",
    title: "Treasurer",
    email: "jonservo@gmail.com",
    role: "Admin"
  }
];
const ManagePortalPage = props => (
  <PageHoc>
    <h1>Manage Campaign Portal</h1>
    <div className="manage-portal-container">
      <div className="manage-users-container">
        <div className="manage-users-table">
          <div className="manage-users-table-header">
            <h2>Users (3)</h2>
            <Button onClick={() => console.log("add user")}>
              Add New User
            </Button>
          </div>
          <div className="manage-users-table-body">
            <Table
              title="Users"
              columns={columnInfo}
              data={seedUsers}
              options={{
                search: false
              }}
              components={{
                Actions: props => (
                  <Button onClick={() => console.log("add user")}>
                    Add New User
                  </Button>
                )
              }}
            />
          </div>
        </div>
      </div>
      <div className="manage-labels" />
    </div>
  </PageHoc>
);
export default ManagePortalPage;
