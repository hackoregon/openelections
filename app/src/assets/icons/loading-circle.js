import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import loader from '../styles/elementes/loader';

const LoadingCircle = ({ radius, color, className }) => (
  <div className={className} css={loader(radius || 20, color || '#000')}>
    Loading...
  </div>
);

export default LoadingCircle;
