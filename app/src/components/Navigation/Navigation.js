// eslint-disable-next-line
import React from 'react';
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

const linkStyle = css`
  /* match link style */
  align-items: normal;
  background-color: rgba(0, 0, 0, 0);
  border-color: rgb(0, 0, 238);
  border-style: none;
  box-sizing: content-box;
  color: white;
  cursor: pointer;
  display: inline;
  font: inherit;
  padding: 0;
  margin: 0 15px;
  perspective-origin: 0 0;
  text-align: start;
  transform-origin: 0 0;
`;

const Navigation = ({ isLoggedIn, logOut, showModal }) => {
  const logOutClick = event => {
    event.preventDefault();
    logOut();
  };
  return (
    <nav css={styles}>
      {!isLoggedIn && (
        <button
          css={linkStyle}
          onClick={() => {
            showModal({
              component: 'Info',
              props: {},
            });
          }}
          type="button"
        >
          Info
        </button>
      )}
      {!isLoggedIn && <NavLink to="/sign-in">Sign in</NavLink>}
      {isLoggedIn && (
        <button css={linkStyle} onClick={logOutClick} type="button">
          Log out
        </button>
      )}
    </nav>
  );
};

export default Navigation;

Navigation.propTypes = {
  showModal: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  logOut: PropTypes.func,
};
