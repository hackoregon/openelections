import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PageHoc from '../../components/PageHoc/PageHoc';

const slideShowStyles = css`
  iframe {
    display: block;
    margin: auto;
    max-width: 100%;
    margin-top: 4vw;
  }
`;

const HomePage = props => {
  return (
    <PageHoc>
      <div css={slideShowStyles} className="slideshow-wrapper">
        <iframe
          title="Demo Slideshow"
          src="https://docs.google.com/presentation/d/e/2PACX-1vRj0QE82D4Iml7BCBaZxdo37pAZOnDyHqCTmFzFO7091GhuTOpOpSj0SU9GqDYewZlU5uL6uqZzbQ7K/embed?start=true&loop=true&delayms=5000"
          frameBorder="0"
          allowFullScreen="true"
          width="960"
          height="569"
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        />
      </div>
    </PageHoc>
  );
};
export default HomePage;
