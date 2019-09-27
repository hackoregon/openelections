import React from 'react';
import { connect } from 'react-redux';
import { MatchPicker } from '../../ContributorMatchPicker';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import FormModal from '../../FormModal/FormModal';
import { getCurrentMatchResults } from '../../../state/ducks/matches';

export const getMatchesById = () => {
  return [
    {
      currentPage: 1,
      totalPages: 2,
      selected: true,
      matchStrength: 0,
      id: 'a',
      name: 'Noah Fence',
      street1: '123 Main Street',
      street2: '',
      city: 'Portland',
      state: 'OR',
      zip: '97203',
    },
    {
      currentPage: 2,
      totalPages: 2,
      selected: false,
      matchStrength: 0,
      id: 'b',
      name: 'Noah Fence',
      street1: '123 Main Street',
      street2: 'Apt 456',
      city: 'Portland',
      state: 'OR',
      zip: '97203',
    },
  ];
};

const data = {
  matchId: '4d3cb3df-0055-4e05-b091-ddf65f48b35a',
  matchStrength: 'exact',
  results: {
    exact: [
      {
        id: '4d3cb3df-0055-4e05-b091-ddf65f48b35a',
        first_name: 'ASHLEY',
        last_name: 'DAVID',
        address_1: '19100 E BURNSIDE ST APT E232',
        address_2: '',
        city: 'PORTLAND',
        state: 'OR',
        zip: '97233',
        address_sim: '1.0',
        zip_sim: '1.0',
        first_name_sim: '1.0',
        last_name_sim: '1.0',
      },
    ],
    strong: [],
    weak: [],
    none: '54a80b958cb6ea7b38e1bab403b84efd',
  },
  inPortland: false,
};

const MatchPickerForm = props => {
  const { currentMatchResults, currentMatchId } = props;
  console.log('mscotto B', currentMatchResults);

  return (
    <FormModal>
      <MatchPicker
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
