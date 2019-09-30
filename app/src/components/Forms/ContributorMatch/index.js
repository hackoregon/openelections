import React from 'react';
import { connect } from 'react-redux';
import { MatchPicker } from '../../ContributorMatchPicker';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import FormModal from '../../FormModal/FormModal';
import { getCurrentMatchResults } from '../../../state/ducks/matches';

const MatchPickerForm = props => {
  const { currentMatchResults, currentMatchId, contributionId } = props;

  return (
    <FormModal>
      <MatchPicker
        contributionId={contributionId}
        currentMatchId={currentMatchId}
        matches={currentMatchResults}
      />
    </FormModal>
  );
};

export default connect(
  state => ({
    getModalState: getModalState(state),
    currentMatchResults: getCurrentMatchResults(state),
  }),
  dispatch => {
    return {
      clearModal: () => dispatch(clearModal()),
    };
  }
)(MatchPickerForm);
