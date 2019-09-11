import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PageHoc from '../../components/PageHoc/PageHoc';

import OAELogo from '../../assets/OAE Logo Cropped.jpg';

const slideShowStyles = css`
  padding: 14vw;
  text-align: center;
  img {
    max-width: 400px;
  }
`;

const HomePage = props => {
  return (
    <PageHoc>
      <div css={slideShowStyles} className="slideshow-wrapper">
        <img src={OAELogo} alt="OAE Logo" />
      </div>
    </PageHoc>
  );
};
export default HomePage;
