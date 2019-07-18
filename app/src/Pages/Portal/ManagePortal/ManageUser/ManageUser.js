import * as React from "react";
import { connect } from "react-redux";
//import queryString from "query-string";
import Button from "../../../../components/Button/Button";
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from "@material-ui/icons/ArrowBack";
import PageHoc from "../../../../components/PageHoc/PageHoc";
import { inviteUser, removeUser } from "../../../../state/ducks/users";
import { showModal } from "../../../../state/ducks/modal";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const finePrint = css`
  color: #333;
  font-size: 0.8em;
`;

const divSpacer = css`
  margin-top: 60px;
`;

const USER_ROLES = {
  "Admin": "campaign_admin",
  "Staff": "campaign_staff"
}
// Todo: get from API

const ManageUserPage = props => { 
  //const params = queryString.parse(props.location.search);
  console.log("DD",props.location);
  const { id, email, userStatus, firstName, lastName, role, roleId } = props.location.state;
  const userRole = USER_ROLES[role];

  return (
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
          <p>{email}</p>
          {console.log("userStatus", userStatus)}
          {userStatus === "invited" && (
            <React.Fragment>
              <p className="fine-print" css={finePrint}>
                This user hasn't finished creating their account.
              </p>
              <Button
                buttonType="primary"
                onClick={() => props.inviteUser(email, firstName, lastName, 1, userRole)} // TODO: set campaign id dynamically
              >
                Resend Invitation
              </Button>
            </React.Fragment>
          )}
        </div>
        <div className="manage-user-role" css={divSpacer}>
          <h2>Mangage Role</h2>
        </div>
        <div className="remove-user">
          <Button
            buttonType="remove"
            
            onClick={() => props.dispatch(showModal({component: "RemoveUser", props: props }))}

          >
            Remove User
          </Button>
        </div>
      </div>
    </PageHoc>
  );};

export default connect(
  state => ({}),
  dispatch => {
    return {
      inviteUser: (email, firstName, lastName, campaignOrGovernmentId, role) => dispatch(inviteUser(email, firstName, lastName, campaignOrGovernmentId, role)),
      removeUser: (userId, permissionId) => dispatch(removeUser(userId, permissionId)),
      dispatch
    };
  }
)(ManageUserPage);
