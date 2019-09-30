/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
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
import { showModal, clearModal } from '../../state/ducks/modal';
import {
  updateMatchForContribution,
  getCurrentContributionMatch,
} from '../../state/ducks/matches';

const Header = props => {
  const {
    contributorMatches,
    currentMatchId,
    showModal,
    form,
    contributionId,
  } = props;
  let matchStrength = 'none';
  let matchSelectedText = '';

  if (contributorMatches[contributionId]) {
    matchStrength = contributorMatches[contributionId].matchStrength;
  }
  if (currentMatchId) {
    matchSelectedText =
      matchStrength === 'none'
        ? 'No matches found'
        : `${matchStrength} match selected`;
  } else {
    matchSelectedText = 'Click to select a match';
  }

  // Switch color and symbol based on matchStrength
  let matchIcon = <NoMatchIcon css={matchColors.no} />;
  if (matchStrength !== 'none') {
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
        <span style={{ fontSize: '.7em' }}>{matchSelectedText}</span>
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

class contributorMatchPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPages: props.matches.length,
      currentPage: 0,
      pages: props.matches || [],
    };
    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e) {
    this.props.updateMatchForContribution({
      contributionId: this.props.contributionId,
      matchId: this.state.pages[this.state.currentPage].id,
      matchStrength: this.state.pages[this.state.currentPage].matchStrength,
    });
    this.props.clearModal();
  }

  render() {
    const inPortland = this.props.matchObj.inPortland;
    const { totalPages, currentPage, pages } = this.state;
    const page = !isEmpty(pages) ? pages[currentPage] : [{}];
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
    } = page;
    return isEmpty(lastName) ? (
      <div>Could not find any matches</div>
    ) : (
      <div css={matchPickerModal.wrapper}>
        <div>
          <div style={{ position: 'absolute', top: '16px' }}>
            {inPortland ? (
              <span css={matchColors.exact}>Address in Portland</span>
            ) : (
              <span css={matchColors.no}>Address not in Portland</span>
            )}
          </div>
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
                  onClick={this.handleSubmit}
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
              {'<'} Previous
            </Link>
          ) : (
            <div />
          )}
          {currentPage < totalPages - 1 ? (
            <Link to="?" onClick={this.nextClick}>
              {currentPage === 0 ? (
                <span>Select another match {'>'} </span>
              ) : (
                <span>Next {'>'}</span>
              )}
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

export const MatchPicker = connect(
  state => ({
    matchObj: getCurrentContributionMatch(state),
  }),
  dispatch => {
    return {
      updateMatchForContribution: matchAttr =>
        dispatch(updateMatchForContribution(matchAttr)),
      clearModal: () => dispatch(clearModal()),
    };
  }
)(contributorMatchPicker);

Header.propTypes = {
  showModal: PropTypes.func,
  contributionId: PropTypes.number,
};

contributorMatchPicker.propTypes = {
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
