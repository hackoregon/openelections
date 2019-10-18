import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Contributions from './Contributions';

class ContributionsPage extends React.Component {
  render() {
    const { history, match } = this.props;
    return <Contributions history={history} match={match} />;
  }
}
export default withRouter(ContributionsPage);

ContributionsPage.propTypes = {
  history: PropTypes.oneOfType([PropTypes.object]),
  match: PropTypes.oneOfType([PropTypes.object]),
};
