import * as React from "react";
import Button from "../../../../components/Button/Button";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import PageHoc from "../../../../components/PageHoc/PageHoc";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const finePrint = css`
  color: #333;
  font-size: 0.8em;
`;

const divSpacer = css`
  margin-top: 60px;
`;

const ManageUserPage = props => (
  <PageHoc>
    <h1>
      <IconButton
        aria-label="Back"
        onClick={() => props.history.push("/manage-portal")}
      >
        <ArrowBack style={{ fontSize: "36px", color: "black" }} />
      </IconButton>
      Manage User
    </h1>
    <div className="manage-user-container">
      <div className="manage-user-intro">
        <h1>User Name</h1>
        <p>username@email.com</p>
        {/* if this user's account is not complete */}
        <p className="fine-print" css={finePrint}>
          This user hasn't finished creating their account.
        </p>
        <Button
          buttonType="primary"
          onClick={() => console.log("Resend Invitation")}
        >
          Resend Invitation
        </Button>
      </div>
      <div className="manage-user-role" css={divSpacer}>
        <h2>Mangage Role</h2>
      </div>
      <div className="remove-user">
        <Button buttonType="remove" onClick={() => {
          console.log("Remove User");
          props.showModal("RemoveUser");
        }}>
          Remove User
        </Button>
      </div>
    </div>
  </PageHoc>
);
export default ManageUserPage;
