import React from "react";
import Navigation from "../Navigation/Navigation";
import { NavLink } from "react-router-dom";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";

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
const ToNavigaiton = props => {
  const { isLoggedIn } = { props };
  return (
    <header css={styles}>
      {console.log(props)}
      <NavLink to={isLoggedIn ? "/dashboard" : "/"} className="header-icon">
        <h1>Open Elections</h1>
      </NavLink>
      <Navigation />
    </header>
  );
};
export default ToNavigaiton;
