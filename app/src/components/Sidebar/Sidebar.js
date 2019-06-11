import React from "react";
import { NavLink } from "react-router-dom";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { accents } from '../../assets/styles/emotion-globals/colors'

const styles = css`
  font-size: 20px;
  
  .campaign-name {
    font-size: 18px;
    color: rgba(0,0,0,0.7);
    font-weight: normal;
    padding: 5px 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {  
      a {
        padding: 5px 20px;
        display: block;
        border-left: 2px solid transparent;
        color: black;
        
        &.active {
          background: rgba(0,0,0,0.05);
          border-left-color: ${accents.purple};
        }
        
        &:hover {
          background: rgba(0,0,0,0.05);
        }
      }
    }
  }
`;

const Sidebar = ({ links }) => {
  return (
    <div css={styles}>
        <h2 className={'campaign-name'}>Campaign Name</h2>
        <ul>
        {links.map( link => <li><NavLink to={link.url}>{link.label}</NavLink></li> )}
        </ul>
    </div>
  );
};

export default Sidebar;
