// eslint-disable-next-line no-unused-vars
import React from 'react';
import { NavLink } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Navigation from '../Navigation/Navigation';

const styles = css`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 0 10px;
  .nav-wrapper {
    flex: 2;
  }
  .header-icon {
    flex: 1;
  }
`;
const HeaderComponent = () => (
  <header css={styles}>
    <NavLink to="/" className="header-icon">
      <h1>Small Donor Elections</h1>
    </NavLink>
    <Navigation />
  </header>
);
export default HeaderComponent;
