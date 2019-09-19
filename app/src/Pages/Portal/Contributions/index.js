import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Contributions from './Contributions';

class ContributionsPage extends React.Component {
  componentDidMount() {
    const {
      getContributions,
      currentUserId,
      governmentId,
      campaignId,
      location,
    } = this.props;

    const filterOptions = this.getQueryParams(location);
    const data = {
      governmentId,
      campaignId,
      currentUserId,
      perPage: 50,
      from: filterOptions.from,
      to: filterOptions.to,
      status: filterOptions.status,
    };
    console.log('mscotto ON THE INDEX');
    // getContributions(data);
  }

  getQueryParams(location) {
    const rawParams = location.search.replace(/^\?/, '');
    const result = {};

    rawParams.split('&').forEach(item => {
      if (item) {
        const [key, val] = item.split('=');
        result[key] = val;
      }
    });

    return result;
  }

  render() {
    return <Contributions {...this.props} />;
  }
}
export default connect()(withRouter(ContributionsPage));
