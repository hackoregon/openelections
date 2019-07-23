// eslint-disable-next-line
import React, { Component } from "react";
import { NavLink } from "react-router-dom";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { accents, mediaQueryRanges } from "../../assets/styles/variables";

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
  
  button.toggle {
    float: right;
  }
  
  @media ${mediaQueryRanges.mediumAndDown} {
    button.toggle {
      display: none;
    }
    
    ul:not(.active) {
      display: none;
    }
  }
`;

export default class Sidebar extends Component {

    state = {
      isToggledOn: false
    };

    constructor (props) {
        super(props);

        this.links = [
            {url: "/dashboard", label: "Dashboard"},
            {url: "/contributions", label: "Contributions"},
            {url: "/expenses", label: "Expenses"},
            {url: "/visualize", label: "Visualize"},
            {url: "/visualize", label: "Visualize"},
            ...((props.governmentId) ? [{url: "/campaigns", label: "Campaigns"}] : []),
            {url: "/manage-portal", label: "Manage Portal"}
        ];
    }

    toggleSidebar () {
        this.setState({isToggledOn: !this.state.isToggledOn});
    }

    render () {
        const {governmentId, campaignName} = this.props;

        return (
            <div css={styles}>
                <button onClick={this.toggleSidebar.bind(this)} className="toggle" aria-hidden={true}>toggle</button>
                <h2 className={"campaign-name"}>{governmentId ? 'City Portal' : campaignName}</h2>
                <ul className={(this.state.isToggledOn) ? 'active' : ''}>
                    {this.links.map(link => (
                        <li key={link.url}>
                            <NavLink to={link.url}>{link.label}</NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
};

