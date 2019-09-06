// eslint-disable-next-line
import React from "react";
import { Link } from 'react-router-dom';
import { Logo } from '@hackoregon/component-library';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Navigation from '../Navigation';

const styles = css`
  background-color: #201921;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  padding: 0 10px;
  .nav-wrapper {
    flex: 2;
  }
  .header-icon {
    align-items: center;
    display: flex;
    flex: 1;
    flex-direction: row;
  }
  .header-icon img {
    margin: 10px;
  }
  .logo-text {
    color: white;
    font-size: 28px;
    line-height: 28px;
  }
`;
const TopNavigation = props => {
  const { isLoggedIn } = props;

  return (
    <header css={styles}>
      <Link to={isLoggedIn ? '/dashboard' : '/'} className="header-icon">
        <Logo type="squareLogoInverted" />
        <p className="logo-text">Open Elections</p>
      </Link>
      <Navigation />
    </header>
  );
};

export default TopNavigation;
