// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import ModalMaterial from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import { css, jsx } from '@emotion/core';
import * as ModalOptions from '../Forms/ModalForms';
/** @jsx jsx */

const modalStyle = css`
  position: absolute;
  width: 400px;
  background: white;
  top: 8vh;
  left: calc(50vw - 175px);
  margin-bottom: 20px;
  max-height: 625px;
`;

const closeModal = css`
  position: sticky;
  display: flex;
  justify-content: flex-end;
  top: 0;
`;

const errorStyle = css`
  text-align: center;
`;

const Modal = props => {
  const { getModalState, customModalStyle, onClose } = props;
  const handleClose = () => {
    props.clearModal();
    onClose();
  };
  const currentModalOptions = ModalOptions[getModalState.currentModal];
  const ModalContent = () =>
    React.createElement(currentModalOptions, getModalState._props);
  const ErrorMessage = () => (
    <div css={errorStyle}>
      <br />
      <br />
      <h2>Error loading modal</h2>
    </div>
  );

  return (
    <ModalMaterial
      style={{ overflowY: 'scroll' }}
      aria-label={`${getModalState.currentModal} modal`}
      open={getModalState.isActive}
      onClose={() => handleClose()}
    >
      <div>
        <div css={customModalStyle || modalStyle}>
          <div css={closeModal}>
            <IconButton aria-label="Back" onClick={() => handleClose()}>
              <Close style={{ fontSize: '26px', color: 'black' }} />
            </IconButton>
          </div>
          {currentModalOptions !== undefined ? (
            <ModalContent />
          ) : (
            <ErrorMessage />
          )}
        </div>
      </div>
    </ModalMaterial>
  );
};
export default Modal;

Modal.propTypes = {
  getModalState: PropTypes.oneOfType([PropTypes.object]),
  clearModal: PropTypes.func,
  onClose: PropTypes.func,
  customModalStyle: PropTypes.oneOfType([PropTypes.object]),
};
