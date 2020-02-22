/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Logo } from '@hackoregon/component-library';

const MadeByFooter = () => (
  <footer
    css={css`
      text-align: center;
      margin: 2em auto;
    `}
  >
    <div>Built with and for the public by:</div>
    <div
      css={css`
        margin: 1em auto;
      `}
    >
      <a
        href="https://www.civicsoftwarefoundation.org"
        target="_blank"
        rel="noopener noreferrer"
        css={css`
          margin: 1em;
        `}
      >
        <Logo type="standardLogo" alt="CIVIC Logo" />
      </a>
      <a
        href="https://www.hackoregon.org"
        target="_blank"
        rel="noopener noreferrer"
        css={css`
          margin: 1em;
        `}
      >
        <Logo type="hackOregon" alt="Hack Oregon Logo" />
      </a>
    </div>
  </footer>
);

export default MadeByFooter;
