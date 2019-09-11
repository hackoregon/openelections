import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Expenses from './Expenses';
import {
  getExpenditures,
  getExpendituresList,
} from '../../../state/ducks/expenditures';
import {
  getCurrentUserId,
  getGovOrCampIdAttributes,
} from '../../../state/ducks/auth';

class ExpensesPage extends React.Component {
  componentDidMount() {
    const {
      getGovOrCampIdAttributes,
      currentUserId,
      getExpenditures,
      location,
    } = this.props;

    const filterOptions = this.getQueryParams(location);
    const data = {
      ...getGovOrCampIdAttributes,
      currentUserId,
      perPage: 50,
      from: filterOptions.from,
      to: filterOptions.to,
      status: filterOptions.status,
    };

    getExpenditures(data);
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
    return <Expenses {...this.props} />;
  }
}
export default connect(
  state => ({
    currentUserId: getCurrentUserId(state),
    isListLoading: state.expenditures.isLoading,
    expendituresList: getExpendituresList(state),
    getGovOrCampIdAttributes: getGovOrCampIdAttributes(state),
  }),
  dispatch => ({ getExpenditures: data => dispatch(getExpenditures(data)) })
)(withRouter(ExpensesPage));
