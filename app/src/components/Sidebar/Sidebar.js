import React from "react";
import { NavLink } from "react-router-dom";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const styles = css`
  
`;

const Sidebar = ({ links }) => {
  return (
    <div css={styles}>
        {links.map( link => <NavLink to={link.url}>{link.label}</NavLink> )}
    </div>
  );
};

export default Sidebar;
