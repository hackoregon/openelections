// eslint-disable-next-line
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { ArrowDropDown } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { accents, mediaQueryRanges } from "../../assets/styles/variables";

const styles = css`
  font-size: 20px;
  
  .sidebar-top {
    padding: 20px;
    color: rgba(0, 0, 0, 0.6);
  }
  
  .campaign-name {
    font-size: 18px;
    font-weight: normal;
    margin-bottom: 0;
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
  
  .arrow {
    display: none;
    float: right;
    transform: translateX(-10px);
    transition: transform 0.2s;
  }
  
  @media ${mediaQueryRanges.mediumAndDown} {
    background-color: rgba(0,0,0,0.04);
    
    .sidebar-top {
      cursor: pointer;
    }
    
    ul {
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    
    .arrow {
      display: block;
      font-size: 1.5em;
    }
    
    &.dropdown-active .arrow {
      transform: rotateZ(180deg) translateX(10px);
    }
    
    
    &:not(.dropdown-active) ul {
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
            <div css={styles} onClick={this.toggleSidebar.bind(this)} className={(this.state.isToggledOn) ? 'dropdown-active' : ''}>
                <div className="sidebar-top">
                    <ArrowDropDown className={'arrow'} />
                    <h2 className={"campaign-name"}>{governmentId ? 'City Portal' : campaignName}</h2>
                </div>
                <ul>
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

