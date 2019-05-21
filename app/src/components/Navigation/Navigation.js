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
  }
`;

const Navigation = props => {
  return (
    <nav css={styles}>
      <NavLink to="/">About</NavLink>
      <NavLink to="/">Sandbox</NavLink>
      <NavLink to="/portal">Portal</NavLink>
    </nav>
  );
};

export default Navigation;
