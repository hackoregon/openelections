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
  const handleClose = x => {
    console.log("me here", x);
    props.clearModal();
  };
  return (
    <ModalMaterial
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
          {ModalOptions[props.getModalState.currentModal] != undefined ? (
           // console.log(props.getModalState)
            React.createElement(ModalOptions[props.getModalState.currentModal], props.getModalState._props)
          ) : (
            <div css={errorStyle}>
              <br />
              <br />
              <h2>Error loading modal</h2>
            </div>
          )}
        </div>
      </div>
    </ModalMaterial>
  );
};

export default Modal;
