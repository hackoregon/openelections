// eslint-disable-next-line
import React from "react";
import Paper from "@material-ui/core/Paper";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const formModalWrapper = css`
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 40px;
`;

const center = css`
  left: calc(50vw - 175px);
  position: absolute;
`;

const FormModal = ({ children }) => (
  <div css={[formModalWrapper, center]}>
    {/* <Paper elevation={1} css={paper}> */}
    {children}
    {/* </Paper> */}
  </div>
);

export default FormModal;
