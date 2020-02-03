import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ManageCampaign from './ManageCampaign';
import { showModal } from '../../../state/ducks/modal';
import {
  isCampaignsLoading,
  getCampaigns,
  getCampaignList,
  updateCampaignName,
} from '../../../state/ducks/campaigns';
import { getCurrentGovernmentId } from '../../../state/ducks/governments';

class ManageCampaignPage extends React.Component {
  componentDidMount() {
    const { getCampaigns, governmentId } = this.props;
    getCampaigns(governmentId);
  }

  render() {
    return <ManageCampaign {...this.props} />;
  }
}

export default connect(
  state => ({
    governmentId: getCurrentGovernmentId(state),
    isCampaignListLoading: isCampaignsLoading(state),
    campaignList: getCampaignList(state),
  }),
  dispatch => {
    return {
      getCampaigns: governmentId => dispatch(getCampaigns(governmentId)),
      showModal: payload => dispatch(showModal(payload)),
      updateCampaignName: (governmentId, campaignId, campaignName) =>
        dispatch(updateCampaignName(governmentId, campaignId, campaignName)),
    };
  }
)(ManageCampaignPage);

ManageCampaignPage.propTypes = {
  getCampaigns: PropTypes.func,
  governmentId: PropTypes.number,
};
