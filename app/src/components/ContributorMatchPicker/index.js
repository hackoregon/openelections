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

function getMatchIcon(matchStrength, inPortland = true) {
  let matchIcon = <NoMatchIcon css={matchColors.no} />;

  if (matchStrength !== 'none') {
    const matchColor =
      !inPortland && matchStrength === 'exact' ? 'no' : matchStrength;
    matchIcon = <MatchIcon css={matchColors[matchColor]} />;
  }
  return matchIcon;
}

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
  let hasMatches = false;
  let inPortland = true;

  if (contributorMatches[contributionId]) {
    matchStrength = contributorMatches[contributionId].matchStrength;
    const x = contributorMatches[contributionId].results;
    hasMatches = !!(x && [...x.exact, ...x.strong, ...x.weak].length);
    inPortland = contributorMatches[contributionId].inPortland;
  }
  if (hasMatches) {
    if (currentMatchId) {
      matchSelectedText =
        matchStrength === 'none'
          ? 'No Match (selected)'
          : `${matchStrength} Match (selected)`;
    } else {
      matchSelectedText = 'Click to select a match';
    }
  } else {
    matchSelectedText =
      matchStrength === 'none'
        ? 'No Matches Found'
        : `${matchStrength} Match (selected)`;
  }
  // Switch color and symbol based on matchStrength
  const matchIcon = getMatchIcon(matchStrength, inPortland);
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
        <span
          style={{
            fontSize: '.7em',
            textTransform: 'capitalize',
            display: 'inline-block',
            verticalAlign: '5px',
          }}
        >
          {matchSelectedText}
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
    const specialExactCase = !!(matchStrength === 'exact' && !inPortland);
    const matchIcon = getMatchIcon(matchStrength, inPortland);
    const noMatchText =
      matchStrength === 'none' && pages.length === 1
        ? 'Could not find any matches'
        : 'No Match';
    return (
      <div css={matchPickerModal.wrapper}>
        <div>
          <div id="matchHeader" style={{ position: 'absolute', top: '16px' }}>
            <div style={{ paddingTop: '5px' }} css={matchPickerModal.matchText}>
              <div>
                {matchIcon}{' '}
                <span
                  css={specialExactCase ? matchColors.no : null}
                  style={{ display: 'inline-block', verticalAlign: '5px' }}
                >
                  Match: {matchStrength}
                </span>
              </div>
            </div>
          </div>
          <div css={matchPickerModal.container}>
            <div id="matchAddress" css={matchPickerModal.addressContainer}>
              <div css={matchPickerModal.address}>
                {matchStrength === 'none' ? (
                  <div
                    css={matchPickerModal.addressFields}
                    style={{
                      padding: '15px 0px',
                      width: '10em',
                      lineHeight: '25px',
                      textAlign: 'center',
                    }}
                  >
                    {noMatchText}
                  </div>
                ) : (
                  <div>
                    {inPortland ? (
                      <span
                        css={[
                          matchColors.exact,
                          matchPickerModal.addressFields,
                        ]}
                      >
                        Address in Portland
                      </span>
                    ) : (
                      <span
                        css={[matchColors.no, matchPickerModal.addressFields]}
                      >
                        Address not in Portland
                      </span>
                    )}
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
                )}
              </div>
            </div>
            <div id="matchAccept" css={matchPickerModal.acceptButtonContainer}>
              <div>
                <Button
                  style={
                    selected && {
                      opacity: '0.9',
                    }
                  }
                  css={matchPickerModal.acceptButton}
                  buttonType="manage"
                  onClick={this.handleSubmit}
                  disabled={selected}
                >
                  {selected ? 'Accepted' : 'Accept'}
                </Button>
              </div>
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
