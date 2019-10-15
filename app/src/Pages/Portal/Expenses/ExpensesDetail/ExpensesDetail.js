import React from 'react';
import PropTypes from 'prop-types';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ExpensesDetailForm from '../../../../components/Forms/ExpensesDetail/index';

class ExpensesDetail extends React.PureComponent {
  render() {
    const { match, history } = this.props;
    let expenditureId = false;
    if (match.params && match.params.id) {
      expenditureId = match.params.id;
      return (
        <PageHoc>
          <ExpensesDetailForm history={history} expenditureId={expenditureId} />
        </PageHoc>
      );
    }
  }
}

ExpensesDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  }),
};

export default ExpensesDetail;
