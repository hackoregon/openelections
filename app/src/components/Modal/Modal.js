// eslint-disable-next-line
import React from "react";
import ModalMaterial from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const modalWrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const modalStyle = css`
  position: absolute;
  width: 350px;
  background: white;
  padding: 50px;
`;

const closeModal = css`
  position: absolute;
  top: 0;
  right: 0;
`;

const Modal = props => (
  <ModalMaterial
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    open={props.modalIsActive}
    onClose={() => props.clearModal()}
  >
    <div css={modalWrapper}>
      {console.log({ props })}
      <div css={modalStyle}>
        <div css={closeModal}>
          <IconButton
            aria-label="Back"
            onClick={x => {
              console.log(x);
            }}
          >
            <Close style={{ fontSize: "26px", color: "black" }} />
          </IconButton>
        </div>
        <h2 id="modal-title">Text in a modal</h2>
        <p id="simple-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p>
      </div>
    </div>
  </ModalMaterial>
);

export default Modal;
