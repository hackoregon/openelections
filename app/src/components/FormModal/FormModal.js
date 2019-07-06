// eslint-disable-next-line
import React from "react";
import Paper from "@material-ui/core/Paper";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const formModalWrapper = css`
  max-width: 350px;
`;
const paper = css`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 40px;
`;

const FormModal = ({ children }) => (
  <div css={formModalWrapper}>
    <Paper elevation={1} css={paper}>
      {children}
    </Paper>
  </div>
);

export default FormModal;
