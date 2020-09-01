/* eslint-disable jsx-a11y/click-events-have-key-events */
// Checked accessibility of a role="link" and should be ok. Assistive tech should send spacebar to trigger onClick.
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { css, jsx } from '@emotion/core';
import logo from '../../assets/icons/oae-logo-custom.svg';

/** @jsx jsx */
import Navigation from '../Navigation';

const styles = css`
  background-color: #23552c;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  padding: 0 10px;
  overflow-x: auto;
  .nav-wrapper {
    flex: 2;
  }
  .header-icon {
    align-items: center;
    display: flex;
    flex: 4;
    flex-direction: row;
  }
  .header-icon img {
    margin: 10px;
  }
  .logo-text {
    color: white;
    font-size: 28px;
    line-height: 28px;
    margin-left: 10px;
  }
  .logo-img {
    display: block;
    height: 60px;
  }
`;
const TopNavigation = props => {
  const { isLoggedIn, resetAll } = props;

  return (
    <header css={styles}>
      {!isLoggedIn && (
        <div className="header-icon">
          <a
            onClick={() => resetAll()}
            role="link"
            className="link-button"
            tabIndex="0"
          >
            <img
              className="logo-img"
              src={logo}
              alt="Open and Accountable Elections logo"
            />
          </a>
          <p className="logo-text">Open & Accountable Elections Portland</p>
        </div>
      )}
      {isLoggedIn && (
        <Link to="/dashboard" className="header-icon">
          <img
            className="logo-img"
            src={logo}
            alt="Open and Accountable Elections logo"
          />
          <p className="logo-text">Open & Accountable Elections Portland</p>
        </Link>
      )}
      <Navigation />
    </header>
  );
};

export default TopNavigation;

TopNavigation.propTypes = {
  isLoggedIn: PropTypes.bool,
  resetAll: PropTypes.func,
};
