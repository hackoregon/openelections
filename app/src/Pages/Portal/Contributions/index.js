import React from 'react';
import { withRouter } from 'react-router-dom';
import Contributions from './Contributions';

class ContributionsPage extends React.Component {
  render() {
    const { history, match } = this.props;
    return <Contributions history={history} match={match} />;
  }
}
export default withRouter(ContributionsPage);
