import React from 'react';
import PropTypes from 'prop-types';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ExpensesDetailForm from '../../../../components/Forms/ExpensesDetail/index';

class ExpensesDetail extends React.PureComponent {
  render() {
    const { match } = this.props;
    let expenditureId = false;
    if (match.params && match.params.id) {
      expenditureId = match.params.id;
      return (
        <PageHoc>
          <ExpensesDetailForm expenditureId={expenditureId} />
        </PageHoc>
      );
    }
  }
}

ExpensesDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default ExpensesDetail;
