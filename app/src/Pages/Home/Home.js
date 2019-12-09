import * as React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PageHoc from '../../components/PageHoc/PageHoc';
import {
  getPublicData,
  publicDataRequest,
  allOffices,
  allCampaigns,
  filteredPublicData,
} from '../../state/ducks/publicData';

class HomePage extends React.Component {
  componentDidMount() {
    const { fetchPublicData } = this.props;
    fetchPublicData();
  }

  render() {
    const { request, allOffices, allCampaigns, filteredData } = this.props;
    const { isLoading, error, data } = request;
    console.log('GOT IT: ', isLoading, error, data);
    console.log('Filtered Data:', filteredData);
    return (
      <PageHoc>
        <h1>Home</h1>
        {isLoading && <em>Loading...</em>}
        {error && <strong>Oh no! {error}</strong>}
        {data && data.features && (
          <p>Data Loaded! {data.features.length} records.</p>
        )}
        <h2>Offices</h2>
        <ol>
          {allOffices.map(office => (
            <li key={office}>{office}</li>
          ))}
        </ol>
        <h2>Campaigns</h2>
        <ol>
          {allCampaigns.map(campaign => (
            <li key={campaign.id}>{campaign.name}</li>
          ))}
        </ol>
      </PageHoc>
    );
  }
}

HomePage.propTypes = {
  fetchPublicData: PropTypes.func,
  request: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    data: PropTypes.object,
  }),
  allOffices: PropTypes.arrayOf(PropTypes.string),
  allCampaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

export default connect(
  state => ({
    request: publicDataRequest(state),
    allOffices: allOffices(state),
    allCampaigns: allCampaigns(state),
    filteredData: filteredPublicData(state),
  }),
  dispatch => {
    return {
      fetchPublicData: () => dispatch(getPublicData()),
    };
  }
)(HomePage);
