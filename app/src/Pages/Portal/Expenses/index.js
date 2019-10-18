import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Expenses from './Expenses';

class ExpensesPage extends React.Component {
  render() {
    const { history, match } = this.props;
    return <Expenses history={history} match={match} />;
  }
}
export default withRouter(ExpensesPage);

ExpensesPage.propTypes = {
  history: PropTypes.oneOfType([PropTypes.object]),
  match: PropTypes.oneOfType([PropTypes.object]),
};
