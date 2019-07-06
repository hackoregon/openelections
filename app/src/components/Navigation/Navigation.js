// eslint-disable-next-line
import React from "react";
import { NavLink } from "react-router-dom";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

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

const Navigation = props => {
  return (
    <nav css={styles}>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/sandbox">Sandbox</NavLink>
      <NavLink to="/portal">Portal</NavLink>
    </nav>
  );
};

export default Navigation;
