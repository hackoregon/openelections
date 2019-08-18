import * as React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { NavLink } from 'react-router-dom';

const styles = css`
  ul {
    list-style: none;
    padding: 0;
    font-size: 20px;
  }
`;

const LinksCard = props => {
  return (
    <div css={styles}>
      <h3>Quick Links</h3>
      <ul>
        {props.links.map((link, key) => (
          <li key={key}>
            <NavLink to={link.path}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default LinksCard;
