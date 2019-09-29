/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { connect } from 'react-redux';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import NoMatchIcon from '@material-ui/icons/ErrorOutlineSharp';
import MatchIcon from '@material-ui/icons/CheckCircleOutlineSharp';
import { Link } from 'react-router-dom';
import { isThisMinute } from 'date-fns';
import Button from '../Button/Button';
import {
  sectionStyles,
  matchPickerModal,
  matchColors,
} from '../../assets/styles/forms.styles';
import { clearModal, showModal } from '../../state/ducks/modal';

const Header = ({
  contributorMatches,
  currentMatchId,
  showModal,
  form,
  contributionId,
}) => {
  let matchStrength = 'no';
  if (contributorMatches[contributionId]) {
    matchStrength = contributorMatches[contributionId].matchStrength;
  }
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
      Contributor {matchIcon}{' '}
      {currentMatchId && (
        <span css={matchColors[matchStrength]} style={{ fontSize: '.7em' }}>
          Selected
        </span>
      )}
    </h3>
  );
};

export const MatchPickerHeader = connect(
  state => ({
    contributorMatches: state.matches.list,
  }),
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
      totalPages: props.matches.length,
      currentPage: 0,
      pages: props.matches || [],
    };
    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
  }

  nextClick(e) {
    e.preventDefault();
    this.setState(state => ({
      currentPage: state.currentPage + 1,
    }));
  }

  prevClick(e) {
    e.preventDefault();
    this.setState(state => ({
      currentPage: state.currentPage - 1,
    }));
  }

  render() {
    const { matches } = this.props;
    const { totalPages, currentPage, pages } = this.state;

    const {
      id,
      bestMatch,
      matchStrength,
      selected,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zip,
    } = pages[currentPage];
    return (
      <div css={matchPickerModal.wrapper}>
        <div>
          <div css={matchPickerModal.container}>
            <div css={matchPickerModal.addressContainer}>
              <div css={matchPickerModal.address}>
                <p css={matchPickerModal.addressFields}>
                  {firstName} {lastName}
                </p>
                <p css={matchPickerModal.addressFields}>{address1}</p>
                {address2 && (
                  <p css={matchPickerModal.addressFields}>{address2}</p>
                )}
                <p css={matchPickerModal.addressFields}>
                  {city}, {state} {zip}
                </p>
              </div>
            </div>
            <div css={matchPickerModal.acceptButtonContainer}>
              {selected ? (
                <span css={matchPickerModal.matchText}>
                  {matchStrength} Match Selected
                </span>
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
          {currentPage > 0 ? (
            <Link to="?" onClick={this.prevClick}>
              Previous
            </Link>
          ) : (
            <div />
          )}
          {currentPage < totalPages - 1 ? (
            <Link to="?" onClick={this.nextClick}>
              Next
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
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
