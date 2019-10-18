// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

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

const LinksCard = ({ links }) => {
  return (
    <div css={styles}>
      <h3>Quick Links</h3>
      <ul>
        {links.map((link, key) => (
          <li key={key}>
            <NavLink to={link.path}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default LinksCard;

LinksCard.propTypes = {
  links: PropTypes.oneOfType([PropTypes.array]),
};
