import React from 'react';
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

const assumeButton = ({
  assume,
  unSetAssume,
  setAssume,
  isGovAdminAuthenticated,
}) => {
  console.log('isGovAdminAuthenticated', isGovAdminAuthenticated);
  return isGovAdminAuthenticated ? (
    <div style={assume ? { backgroundColor: 'red' } : null}>
      <Button
        buttonType={assume ? 'red' : null}
        style={assume ? { backgroundColor: 'red', width: '100%' } : null}
        onClick={() => {
          if (assume) {
            unSetAssume();
          } else {
            setAssume();
          }
        }}
      >
        {assume ? 'EDIT MODE ON - Click to turn off' : 'Turn on edit mode'}
      </Button>
    </div>
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
  unSetAssume: PropTypes.func,
  setAssume: PropTypes.func,
};

export { AssumeButton };
