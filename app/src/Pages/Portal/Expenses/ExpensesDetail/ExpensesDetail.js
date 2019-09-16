import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ExpensesDetailForm from '../../../../components/Forms/ExpensesDetail/index';
import {
  getExpenditureById,
  getCurrentExpenditure,
} from '../../../../state/ducks/expenditures';
import { mapExpenditureDataToForm } from '../ExpendituresFields';
import { PageTransitionImage } from '../../../../components/PageTransistion';

class ExpensesDetail extends Component {
  componentDidMount() {
    const { getExpenditureById, expenditureId } = this.props;
    if (expenditureId) getExpenditureById(parseInt(expenditureId));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(nextProps.currentExpenditure !== this.props.currentExpenditure);
  }

  render() {
    const { expenditureId, currentExpenditure } = this.props;
    if (currentExpenditure) {
      const data = mapExpenditureDataToForm(currentExpenditure);
      return (
        <PageHoc>
          <ExpensesDetailForm data={data} expenditureId={expenditureId} />
        </PageHoc>
      );
    }
    return <PageTransitionImage />;
  }
}

ExpensesDetail.propTypes = {
  getExpenditureById: PropTypes.func,
  expenditureId: PropTypes.number,
  currentExpenditure: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default connect(
  (state, ownProps) => ({
    expenditureId: parseInt(ownProps.match.params.id),
    currentExpenditure: getCurrentExpenditure(state),
  }),
  dispatch => ({
    getExpenditureById: id => dispatch(getExpenditureById(id)),
  })
)(ExpensesDetail);
