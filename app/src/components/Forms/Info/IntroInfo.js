import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const contentStyle = css`
  padding: 0 2em;
  max-width: 700px;
  margin: 1em auto;
  button {
    color: #5e63f6;
  }
`;

const IntroInfo = () => {
  return (
    <>
      <section css={contentStyle}>
        <h2>Open and Accountable Elections</h2>
        <p>
          <a href="https://portlandoregon.gov/oae">
            Open and Accountable Elections
          </a>{' '}
          is the City of Portland's small donor matching program. It is designed
          to ensure that the City government is accountable to all Portlanders,
          not just big campaign donors.
        </p>
        <p>
          This real-time dashboard shows contribution sources for participating
          candidates.
        </p>
      </section>
    </>
  );
};

export default IntroInfo;
