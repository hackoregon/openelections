/* eslint-disable jsx-a11y/no-static-element-interactions */
// eslint-disable-next-line
import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { ArrowDropDown } from '@material-ui/icons';
import PropTypes from 'prop-types';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { accents, mediaQueryRanges } from '../../assets/styles/variables';

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
          border-left-color: ${accents.green};
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
    background-color: rgba(0, 0, 0, 0.04);

    .sidebar-top {
      cursor: pointer;
    }

    ul {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
    isToggledOn: false,
  };

  constructor(props) {
    super(props);
    this.setLinks();
  }

  // eslint-disable-next-line react/sort-comp
  setLinks() {
    const { isAssumed, isGovAdmin } = this.props;
    this.links = [];
    isAssumed || this.links.push({ url: '/dashboard', label: 'Dashboard' });
    this.links.push({ url: '/contributions', label: 'Contributions' });
    this.links.push({ url: '/expenses', label: 'Expenses' });
    isAssumed || this.links.push({ url: '/visualize', label: 'Visualize' });
    isGovAdmin &&
      (isAssumed || this.links.push({ url: '/campaigns', label: 'Campaigns' }));
    isAssumed || this.links.push({ url: '/settings', label: 'Settings' });
  }

  componentDidUpdate(prevProps) {
    const { campaignId, getCampaignUsers, isGovAdmin } = this.props;
    if (!isGovAdmin && prevProps.campaignId !== campaignId) {
      getCampaignUsers(campaignId);
    }
  }

  toggleSidebar() {
    this.setState(state => {
      return { isToggledOn: !state.isToggledOn };
    });
  }

  render() {
    const { campaignName, isGovAdmin, isAssumed } = this.props;
    const { isToggledOn } = this.state;
    this.setLinks();
    let displayName = isGovAdmin ? 'City Portal' : campaignName;
    displayName = isAssumed ? 'Campaign Edit' : displayName;
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        css={styles}
        onClick={this.toggleSidebar.bind(this)}
        className={isToggledOn ? 'dropdown-active' : ''}
      >
        <div className="sidebar-top">
          <ArrowDropDown className="arrow" />
          <h2 className="campaign-name">{displayName}</h2>
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
}

Sidebar.propTypes = {
  isAssumed: PropTypes.bool,
  campaignId: PropTypes.number,
  getCampaignUsers: PropTypes.func,
  isGovAdmin: PropTypes.bool,
  campaignName: PropTypes.string,
};
