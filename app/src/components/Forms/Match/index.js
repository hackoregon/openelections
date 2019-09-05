import React from 'react';
import { connect } from 'react-redux';
import { MatchPicker } from '../../MatchPicker/MatchPicker';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import FormModal from '../../FormModal/FormModal';

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

const MatchPickerForm = props => {
  const { contributionId } = props;
  const matches = getMatchesById(contributionId);
  const match = matches[1];
  return (
    <FormModal>
      <MatchPicker {...match} />
    </FormModal>
  );
};

export default connect(
  state => ({
    getModalState: getModalState(state),
  }),
  dispatch => {
    return {
      clearModal: () => dispatch(clearModal()),
    };
  }
)(MatchPickerForm);
