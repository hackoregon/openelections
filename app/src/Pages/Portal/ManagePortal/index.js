import React from 'react';
import { connect } from 'react-redux';
import ManagePortal from './ManagePortal';
import {
  getUsers,
  getCampaignUsers,
  getGovernmentUsers,
  isUsersLoading,
} from '../../../state/ducks/users';
import { getCurrentGovernmentId } from '../../../state/ducks/governments';
import { isGovAdmin, getCurrentCampaignId } from '../../../state/ducks/auth';
import { showModal } from '../../../state/ducks/modal';

class ManagePortalPage extends React.Component {
  componentDidMount() {
    const {
      governmentId,
      campaignId,
      isGovAdmin,
      getCampaignUsers,
      getGovernmentUsers,
    } = this.props;

    if (isGovAdmin) {
      getGovernmentUsers(governmentId);
    } else {
      getCampaignUsers(campaignId);
    }
  }

  render() {
    return <ManagePortal {...this.props} />;
  }
}

export default connect(
  state => ({
    isGovAdmin: isGovAdmin(state),
    isUserListLoading: isUsersLoading(state),
    userList: getUsers(state),
    campaignId: getCurrentCampaignId(state),
    governmentId: getCurrentGovernmentId(state),
  }),
  dispatch => {
    return {
      getCampaignUsers: id => dispatch(getCampaignUsers(id)),
      getGovernmentUsers: id => dispatch(getGovernmentUsers(id)),
      showModal: payload => {
        dispatch(showModal(payload));
      },
    };
  }
)(ManagePortalPage);
