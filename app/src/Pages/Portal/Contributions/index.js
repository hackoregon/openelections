import React from 'react';
import { connect } from 'react-redux';
import Contributions from './Contributions';
import { getContributions } from '../../../state/ducks/contributions';

class ContributionsPage extends React.Component {
  componentDidMount() {
    // TODO: API requires government and campaign ID, is that available to campaign users?
    this.props.getContributions({
      governmentId: 1,
      campaignId: 1,
      currentUserId: 1,
    });
  }

  render() {
    return <Contributions {...this.props} />;
  }
}
export default connect(
  state => ({}),
  dispatch => ({ getContributions: data => dispatch(getContributions(data)) })
)(ContributionsPage);
