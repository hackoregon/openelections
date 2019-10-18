// eslint-disable-next-line
import React from "react";
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const styles = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 2;
  a {
    margin: 0 15px;
    color: white;
  }
`;

const Navigation = ({ isLoggedIn, logOut }) => {
  const logOutClick = event => {
    event.preventDefault();
    logOut();
  };
  return (
    <nav css={styles}>
      {!isLoggedIn && <NavLink to="/sign-in">Sign in</NavLink>}
      {isLoggedIn && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="" onClick={logOutClick}>
          Log out
        </a>
      )}
    </nav>
  );
};

export default Navigation;

Navigation.propTypes = {
  isLoggedIn: PropTypes.bool,
  logOut: PropTypes.func,
};
