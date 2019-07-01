import React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import Button from "../../../components/Button/Button";

const seedUser = [
  {
    firstName: "Jonathon",
    lastName: "Servos",
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
          <div className="manage-users-table-body" />
        </div>
      </div>
      <div className="manage-labels" />
    </div>
  </PageHoc>
);
export default ManagePortalPage;
