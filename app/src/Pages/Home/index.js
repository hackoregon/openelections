import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getPublicData,
  publicDataRequest,
  allOffices,
  availableCampaigns,
  availableCampaignNames,
  selectedOffices,
  selectedCampaigns,
  selectedCampaignNames,
  selectedStartDate,
  selectedEndDate,
  selectedCount,
  filteredPublicData,
  campaignsTable,
  mapData,
  aggregatedContributorTypes,
  aggregatedDonationSize,
  aggregatedContributionsByRegion,
  donationSizeByDonationRange,
  setSelectedOffices,
  setSelectedCampaigns,
  setSelectedStartDate,
  setSelectedEndDate,
  setSelectedCount,
  summaryData,
  summaryDataByParticipation,
  resetAll,
  externalPublicDataRequest,
  getExternalPublicData,
} from '../../state/ducks/publicData';
import { showModal } from '../../state/ducks/modal';
import Home from './Home';

class HomePage extends React.Component {
  componentDidMount() {
    const { fetchPublicData, fetchExternalPublicData } = this.props;
    fetchPublicData();
    fetchExternalPublicData();
  }

  render() {
    return <Home {...this.props} />;
  }
}

HomePage.propTypes = {
  fetchPublicData: PropTypes.func,
  fetchExternalPublicData: PropTypes.func,
};

export default connect(
  state => ({
    request: publicDataRequest(state),
    externalRequest: externalPublicDataRequest(state),
    allOffices: allOffices(state),
    availableCampaigns: availableCampaigns(state),
    availableCampaignNames: availableCampaignNames(state),
    selectedOffices: selectedOffices(state),
    selectedCampaigns: selectedCampaigns(state),
    selectedCampaignNames: selectedCampaignNames(state),
    selectedStartDate: selectedStartDate(state),
    selectedEndDate: selectedEndDate(state),
    selectedCount: selectedCount(state),
    filteredData: filteredPublicData(state),
    campaignsTable: campaignsTable(state),
    mapData: mapData(state),
    aggregatedContributorTypes: aggregatedContributorTypes(state),
    aggregatedDonationSize: aggregatedDonationSize(state),
    aggregatedContributionsByRegion: aggregatedContributionsByRegion(state),
    donationSizeByDonationRange: donationSizeByDonationRange(state),
    summaryData: summaryData(state),
    summaryDataByParticipation: summaryDataByParticipation(state),
  }),
  dispatch => {
    return {
      fetchPublicData: () => dispatch(getPublicData()),
      fetchExternalPublicData: () => dispatch(getExternalPublicData()),
      setSelectedOffices: offices => dispatch(setSelectedOffices(offices)),
      setSelectedCampaigns: campaigns =>
        dispatch(setSelectedCampaigns(campaigns)),
      setDateRange: (from, to) => {
        dispatch(setSelectedStartDate(from));
        dispatch(setSelectedEndDate(to));
      },
      setSelectedCount: count => dispatch(setSelectedCount(count)),
      resetAll: () => dispatch(resetAll()),
      showModal: payload => {
        dispatch(showModal(payload));
      },
    };
  }
)(HomePage);
