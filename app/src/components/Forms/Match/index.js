import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';

import { MatchPicker } from '../../MatchPicker/MatchPicker';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import FormModal from '../../FormModal/FormModal';
/** @jsx jsx */

const removeUserStyle = css`
  word-break: break-word;
  max-width: 300px;
`;
const buttonContainer = css`
  display: flex;
  margin-top: 30px;
  button {
    margin: 10px;
  }
`;
const removeUserTitle = css`
  font-size: 36px;
`;

const MatchPickerForm = props => {
  return (
    <FormModal>
      <MatchPicker />
    </FormModal>
  );
};
// export default RemoveUser;
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
