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
  selectedFinancing,
  selectedCampaigns,
  selectedCampaignNames,
  selectedStartDate,
  selectedEndDate,
  selectedCount,
  selectedCompare,
  filteredPublicData,
  campaignsTable,
  mapData,
  aggregatedContributorTypes,
  aggregatedContributorTypesByCandidate,
  aggregatedDonationSize,
  aggregatedDonationSizeByCandidate,
  aggregatedContributionsByRegion,
  aggregatedContributionsByRegionByCandidate,
  donationSizeByDonationRange,
  donationSizeByDonationRangeByCandidate,
  setSelectedOffices,
  setSelectedFinancing,
  setSelectedCampaigns,
  setSelectedStartDate,
  setSelectedEndDate,
  setSelectedCount,
  setSelectedCompare,
  summaryData,
  summaryDataByParticipation,
  resetAll,
  setCustomFilters,
  externalPublicDataRequest,
  getExternalPublicData,
  mostRecentExternalContributionDate,
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
    console.log(this.props);
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
    selectedFinancing: selectedFinancing(state),
    selectedCampaigns: selectedCampaigns(state),
    selectedCampaignNames: selectedCampaignNames(state),
    selectedStartDate: selectedStartDate(state),
    selectedEndDate: selectedEndDate(state),
    selectedCount: selectedCount(state),
    selectedCompare: selectedCompare(state),
    filteredData: filteredPublicData(state),
    campaignsTable: campaignsTable(state),
    mapData: mapData(state),
    aggregatedContributorTypes: aggregatedContributorTypes(state),
    aggregatedContributorTypesByCandidate: aggregatedContributorTypesByCandidate(
      state
    ),
    aggregatedDonationSize: aggregatedDonationSize(state),
    aggregatedDonationSizeByCandidate: aggregatedDonationSizeByCandidate(state),
    aggregatedContributionsByRegion: aggregatedContributionsByRegion(state),
    aggregatedContributionsByRegionByCandidate: aggregatedContributionsByRegionByCandidate(
      state
    ),
    donationSizeByDonationRange: donationSizeByDonationRange(state),
    donationSizeByDonationRangeByCandidate: donationSizeByDonationRangeByCandidate(
      state
    ),
    summaryData: summaryData(state),
    summaryDataByParticipation: summaryDataByParticipation(state),
    mostRecentExternalContributionDate: mostRecentExternalContributionDate(
      state
    ),
  }),
  dispatch => {
    return {
      fetchPublicData: () => dispatch(getPublicData()),
      fetchExternalPublicData: () => dispatch(getExternalPublicData()),
      setSelectedOffices: offices => dispatch(setSelectedOffices(offices)),
      setSelectedFinancing: financing =>
        dispatch(setSelectedFinancing(financing)),
      setSelectedCampaigns: campaigns =>
        dispatch(setSelectedCampaigns(campaigns)),
      setDateRange: (from, to) => {
        dispatch(setSelectedStartDate(from));
        dispatch(setSelectedEndDate(to));
      },
      setSelectedCount: count => dispatch(setSelectedCount(count)),
      setSelectedCompare: compare => dispatch(setSelectedCompare(compare)),
      resetAll: () => dispatch(resetAll()),
      setCustomFilters: filters => dispatch(setCustomFilters(filters)),
      showModal: payload => {
        dispatch(showModal(payload));
      },
    };
  }
)(HomePage);
