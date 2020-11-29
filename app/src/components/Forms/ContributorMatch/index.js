import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MatchPicker } from '../../ContributorMatchPicker';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import FormModal from '../../FormModal/FormModal';
import { getCurrentMatchResults } from '../../../state/ducks/matches';

const MatchPickerForm = props => {
  const {
    currentMatchResults,
    currentMatchId,
    contributionId,
    userEnteredFirstName,
    userEnteredLastName,
    userEnteredAddress1,
    userEnteredAddress2,
    userEnteredCity,
    userEnteredState,
    userEnteredZip,
  } = props;

  return (
    <FormModal>
      <MatchPicker
        contributionId={contributionId}
        currentMatchId={currentMatchId}
        matches={currentMatchResults}
        userEnteredFirstName={userEnteredFirstName}
        userEnteredLastName={userEnteredLastName}
        userEnteredAddress1={userEnteredAddress1}
        userEnteredAddress2={userEnteredAddress2}
        userEnteredCity={userEnteredCity}
        userEnteredState={userEnteredState}
        userEnteredZip={userEnteredZip}
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

MatchPickerForm.propTypes = {
  currentMatchResults: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  currentMatchId: PropTypes.string,
  contributionId: PropTypes.number,
  userEnteredFirstName: PropTypes.string,
  userEnteredLastName: PropTypes.string,
  userEnteredAddress1: PropTypes.string,
  userEnteredAddress2: PropTypes.string,
  userEnteredCity: PropTypes.string,
  userEnteredState: PropTypes.string,
  userEnteredZip: PropTypes.string,
};
