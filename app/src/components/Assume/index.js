import React from 'react'; // eslint-disable-line no-unused-vars
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setAssume,
  unSetAssume,
  isGovAdminAuthenticated,
} from '../../state/ducks/auth';
import Button from '../Button/Button';

const assumeButton = ({ assume, setAssume, isGovAdminAuthenticated }) => {
  return isGovAdminAuthenticated && !assume ? (
    <Button
      buttonType={assume ? 'red' : null}
      style={assume ? { backgroundColor: 'red' } : null}
      onClick={setAssume}
    >
      Turn on edit mode
    </Button>
  ) : null;
};

const AssumeButton = connect(
  state => ({
    assume: state.auth.assume,
    isGovAdminAuthenticated: isGovAdminAuthenticated(state),
  }),
  dispatch => ({
    setAssume: () => dispatch(setAssume()),
    unSetAssume: () => dispatch(unSetAssume()),
  })
)(assumeButton);

assumeButton.propTypes = {
  assume: PropTypes.bool,
  isGovAdminAuthenticated: PropTypes.bool,
  setAssume: PropTypes.func,
};

const assumeBar = ({ assume, unSetAssume }) => {
  return assume ? (
    <div style={{ backgroundColor: 'red' }}>
      <Button
        buttonType="red"
        style={{ backgroundColor: 'red', width: '100%' }}
        onClick={() => unSetAssume()}
      >
        EDIT MODE ON - Click to turn off
      </Button>
    </div>
  ) : null;
};

const AssumeBar = connect(
  state => ({
    assume: state.auth.assume,
    isGovAdminAuthenticated: isGovAdminAuthenticated(state),
  }),
  dispatch => ({
    setAssume: () => dispatch(setAssume()),
    unSetAssume: () => dispatch(unSetAssume()),
  })
)(assumeBar);

assumeBar.propTypes = {
  assume: PropTypes.bool,
  unSetAssume: PropTypes.func,
};

export { AssumeButton, AssumeBar };
