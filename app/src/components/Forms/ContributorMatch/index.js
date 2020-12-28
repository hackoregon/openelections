import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MatchPicker } from '../../ContributorMatchPicker';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import FormModal from '../../FormModal/FormModal';
import { getCurrentMatchResults } from '../../../state/ducks/matches';
import { getCurrentContribution } from '../../../state/ducks/contributions';

const MatchPickerForm = props => {
  const {
    currentMatchResults,
    currentMatchId,
    contributionId,
    currentContribution,
  } = props;

  return (
    <FormModal>
      <MatchPicker
        contributionId={contributionId}
        currentMatchId={currentMatchId}
        matches={currentMatchResults}
        currentContribution={currentContribution}
      />
    </FormModal>
  );
};

export default connect(
  state => ({
    getModalState: getModalState(state),
    currentMatchResults: getCurrentMatchResults(state),
    currentContribution: getCurrentContribution(state),
  }),
  dispatch => {
    return {
      clearModal: () => dispatch(clearModal()),
    };
  }
)(MatchPickerForm);

MatchPickerForm.propTypes = {
  currentMatchResults: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  currentContribution: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  currentMatchId: PropTypes.string,
  contributionId: PropTypes.number,
};
