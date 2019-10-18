// eslint-disable-next-line
import React from "react";
import PropTypes from 'prop-types';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const formModalWrapper = css`
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 40px;
  height: 100%;
  overflow: auto;
`;

// TODO: need to fix position, absolute causes other form styling to fail
// const center = css`
//   left: calc(50vw - 175px);
// `;

const FormModal = ({ children }) => (
  <div css={[formModalWrapper]}>{children}</div>
);

export default FormModal;

FormModal.propTypes = {
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};
