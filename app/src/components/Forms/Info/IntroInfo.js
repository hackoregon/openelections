/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';

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
        <h2>Small Donor Elections Portland</h2>
        <p>
          <a
            href="https://portlandoregon.gov/oae"
            target="_blank"
            rel="noopener noreferrer"
          >
            Small Donor Elections
          </a>{' '}
          is the City of Portland&apos;s small donor matching program. It is
          designed to ensure that the City government is accountable to all
          Portlanders, not just big campaign donors.
        </p>
        <p>
          This real-time dashboard shows contribution sources for participating
          candidates, with filter options to show non-participating candidates.
        </p>
      </section>
    </>
  );
};

export default IntroInfo;
