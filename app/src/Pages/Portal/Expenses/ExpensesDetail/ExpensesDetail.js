import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageHoc from '../../../../components/PageHoc/PageHoc';
import ExpensesDetailForm from '../../../../components/Forms/ExpensesDetail/index';
import { getActivities } from '../../../../state/ducks/activities';
import { postExpenditureComment } from '../../../../state/ducks/expenditures';

class ExpensesDetail extends React.PureComponent {
  componentDidMount() {
    this.setState({
      activitiesList: this.props.getActivities,
      postExpenditureComment: this.props.postExpenditureComment,
    });
  }

  render() {
    const { match, getActivities } = this.props;
    let expenditureId = false;
    if (match.params && match.params.id) {
      expenditureId = match.params.id;
      return (
        <PageHoc>
          <ExpensesDetailForm
            activitiesList={getActivities}
            expenditureId={expenditureId}
          />
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

export default connect(state => ({
  getActivities: getActivities(state),
  postExpenditureComment: postExpenditureComment(state),
}))(ExpensesDetail);
