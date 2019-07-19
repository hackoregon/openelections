import React, { Component } from "react";
import { connect } from "react-redux";
import ManagePortal from "./ManagePortal";
import { getUsers, getCampaignUsers, isUsersLoading } from "../../../state/ducks/users";
import { showModal } from "../../../state/ducks/modal";

class ManagePortalPage extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getCampaignUsers(this.props.campaignId);
  }

  render() {
    return <ManagePortal {...this.props} />;
  }
}

export default connect(
  state => ({
    isUserListLoading: isUsersLoading(state),
    userList: getUsers(state),
    campaignId: state.campaigns.currentCampaignId
  }),
  dispatch => {
    return {
      getCampaignUsers: (id) => dispatch(getCampaignUsers(id)),
      showModal: payload => {
        dispatch(showModal({ component: payload }));
      }
    };
  }
)(ManagePortalPage);
