// eslint-disable-next-line
import React from "react";
import { NavLink } from "react-router-dom";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { accents } from "../../assets/styles/variables";

const styles = css`
  font-size: 20px;

  .campaign-name {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: normal;
    padding: 5px 20px;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      a {
        padding: 5px 20px;
        display: block;
        border-left: 4px solid transparent;
        color: black;

        &.active {
          background: rgba(0, 0, 0, 0.05);
          border-left-color: ${accents.purple};
        }

        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
`;

const Sidebar = ({ governmentId, campaignName }) => {
    const links = [
        { url: "/dashboard", label: "Dashboard" },
        { url: "/contributions", label: "Contributions" },
        { url: "/expenses", label: "Expenses" },
        { url: "/visualize", label: "Visualize" },
        { url: "/visualize", label: "Visualize" },
        ...((governmentId) ? [{ url: "/campaigns", label: "Campaigns" }] : []),
        { url: "/manage-portal", label: "Manage Portal" }
    ];
  return (
    <div css={styles}>
      <h2 className={"campaign-name"}>{governmentId ? 'City Portal' : campaignName}</h2>
      <ul>
        {links.map(link => (
          <li key={link.url}>
            <NavLink to={link.url}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
