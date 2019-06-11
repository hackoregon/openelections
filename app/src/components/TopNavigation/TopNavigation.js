import React from "react";
import Navigation from "../Navigation/Navigation";
import { NavLink } from "react-router-dom";
import { Logo } from "@hackoregon/component-library";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const styles = css`
  background-color: #201921;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 0;
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
const ToNavigaiton = props => {
  const { isLoggedIn } = { props };
  return (
    <header css={styles}>
      {console.log(props)}
      <NavLink to={isLoggedIn ? "/dashboard" : "/"} className="header-icon">
        <Logo type="squareLogoInverted" />
        <p className="logo-text">Open Elections</p>
      </NavLink>
      <Navigation />
    </header>
  );
};
export default ToNavigaiton;
