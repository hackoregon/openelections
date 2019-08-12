// eslint-disable-next-line
import React from "react";
import ModalMaterial from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import * as ModalOptions from "../Forms/ModalForms";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const modalStyle = css`
  position: absolute;
  width: 350px;
  background: white;
  top: 8vh;
  left: calc(50vw - 175px);
  margin-bottom: 20px;
  max-height: 625px;
`;

const closeModal = css`
  position: absolute;
  top: 0;
  right: 0;
`;

const errorStyle = css`
  text-align: center;
`;

const Modal = props => {
  const handleClose = x => props.clearModal()
  const currentModalOptions = ModalOptions[props.getModalState.currentModal]
  const ModalContent = () => React.createElement(currentModalOptions, props.getModalState._props)
  const ErrorMessage = () =>
    <div css={errorStyle}>
      <br />
      <br />
      <h2>Error loading modal</h2>
    </div>

  return (
    <ModalMaterial
        style={{ overflowY: 'scroll' }}
      aria-label={props.getModalState.currentModal + " modal"}
      open={props.getModalState.isActive}
      onClose={() => handleClose()}
    >
      <div>
        <div css={modalStyle}>
          <div css={closeModal}>
            <IconButton aria-label="Back" onClick={() => handleClose()}>
              <Close style={{ fontSize: "26px", color: "black" }} />
            </IconButton>
          </div>
          {currentModalOptions != undefined ? <ModalContent /> : <ErrorMessage />}
        </div>
      </div>
    </ModalMaterial>
  );
};
export default Modal;
