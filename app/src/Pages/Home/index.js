import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getPublicData,
  publicDataRequest,
  allOffices,
  availableCampaigns,
  selectedOffices,
  selectedCampaigns,
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
} from '../../state/ducks/publicData';
import { showModal } from '../../state/ducks/modal';
import Home from './Home';

class HomePage extends React.Component {
  componentDidMount() {
    const { fetchPublicData } = this.props;
    fetchPublicData();
  }

  render() {
    return <Home {...this.props} />;
  }
}

HomePage.propTypes = {
  fetchPublicData: PropTypes.func,
  request: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    data: PropTypes.object,
  }),
};

export default connect(
  state => ({
    request: publicDataRequest(state),
    allOffices: allOffices(state),
    availableCampaigns: availableCampaigns(state),
    selectedOffices: selectedOffices(state),
    selectedCampaigns: selectedCampaigns(state),
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
  }),
  dispatch => {
    return {
      fetchPublicData: () => dispatch(getPublicData()),
      setSelectedOffices: offices => dispatch(setSelectedOffices(offices)),
      setSelectedCampaigns: campaigns =>
        dispatch(setSelectedCampaigns(campaigns)),
      setDateRange: (from, to) => {
        dispatch(setSelectedStartDate(from));
        dispatch(setSelectedEndDate(to));
      },
      setSelectedCount: count => dispatch(setSelectedCount(count)),
      showModal: payload => {
        dispatch(showModal(payload));
      },
    };
  }
)(HomePage);
