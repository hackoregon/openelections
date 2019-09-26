/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { connect } from 'react-redux';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import NoMatchIcon from '@material-ui/icons/ErrorOutlineSharp';
import MatchIcon from '@material-ui/icons/CheckCircleOutlineSharp';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import {
  sectionStyles,
  matchPickerModal,
  matchColors,
} from '../../assets/styles/forms.styles';
import { clearModal, showModal } from '../../state/ducks/modal';

const Header = ({
  currentMatchId,
  showModal,
  form,
  contributionId,
  matchStrength,
}) => {
  // Switch color and symbol based on matchStrength
  let matchIcon = <NoMatchIcon css={matchColors.no} />;
  if (matchStrength !== 'no') {
    matchIcon = <MatchIcon css={matchColors[matchStrength]} />;
  }
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <h3
      css={sectionStyles.title}
      // Data will auto propigate to props of modal so
      onClick={() =>
        showModal({
          component: 'MatchPickerForm',
          props: { contributionId, currentMatchId },
        })
      }
    >
      Contributor {matchIcon}
    </h3>
  );
};

export const MatchPickerHeader = connect(
  state => ({}),
  dispatch => {
    return {
      showModal: payload => dispatch(showModal(payload)),
    };
  }
)(Header);

export class MatchPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  render() {
    const { currentMatchId, matchStrength, matches } = this.props;
    // Add state to hold current match
    const matchStrengthText = `${matchStrength} Match Selected`;
    const { name, street1, street2, city, state, zip } = matches;
    const selected = false;
    const currentPage = 1;
    return (
      <div css={matchPickerModal.wrapper}>
        <div>
          <div css={matchPickerModal.container}>
            <div css={matchPickerModal.addressContainer}>
              <div css={matchPickerModal.address}>
                {name}
                <p>{street1}</p>
                {street2 || <p>{street2}</p>}
                <p>
                  {city}, {state} {zip}
                </p>
              </div>
            </div>
            <div css={matchPickerModal.acceptButtonContainer}>
              {selected ? (
                <span>{matchStrengthText}</span>
              ) : (
                <Button
                  css={matchPickerModal.acceptButton}
                  buttonType="manage"
                  onClick={() =>
                    console.log(
                      'post contributionId, matchResult strength and id to update match result duct. If the user selects none, update the matchResultStrength to None and post the id'
                    )
                  }
                >
                  Accept
                </Button>
              )}
            </div>
          </div>
        </div>
        <div css={matchPickerModal.linksContainer}>
          {currentPage > 1 ? <Link to="/">Previous</Link> : null}
          <Link to="/">Next</Link>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  matchStrength: PropTypes.string,
  showModal: PropTypes.func,
  contributionId: PropTypes.number,
};

MatchPicker.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  street1: PropTypes.string,
  street2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  zip: PropTypes.string,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  selected: PropTypes.bool,
};
