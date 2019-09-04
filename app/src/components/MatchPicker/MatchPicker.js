/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { connect } from 'react-redux';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import NoMatchIcon from '@material-ui/icons/ErrorOutlineSharp';
import MatchIcon from '@material-ui/icons/CheckCircleOutlineSharp';
import Button from '../Button/Button';
import {
  containers,
  headerStyles,
  sectionStyles,
  buttonBar,
  matchColors,
} from '../../assets/styles/forms.styles';
import FormModal from '../FormModal/FormModal';
import { clearModal, showModal } from '../../state/ducks/modal';

const Header = ({ matchStrength, showModal, form, contributionId }) => {
  // Switch color and symbol based on matchStrength. Examples:
  // const MatchIcon = <NoMatchIcon css={matchColors.no} />;
  const matchIcon = <MatchIcon css={matchColors.exact} />;
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <h3
      css={sectionStyles.title}
      // Data will auto propigate to props of modal so
      onClick={() =>
        showModal({ component: 'MatchPickerForm', props: { contributionId } })
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

export const MatchPicker = ({
  currentPage = 2,
  totalPages = 10,
  selected,
  matchStrength,
  id,
  name = 'Noah Fence',
  street1 = '123 Main Street',
  street2,
  city = 'Portland',
  state = 'OR',
  zip = '97203',
}) => {
  const matchStrengthText = `${matchStrength} Match Selected`;
  return (
    <FormModal>
      <div css={containers.main}>
        <div>
          <div>{name}</div>
          <div>{street1}</div>
          {street2 || <div>{street2}</div>}
          <div>
            <div>
              <div css={containers.cityStateZip}>
                <div>
                  {city}, {state} {zip}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>{selected ? matchStrengthText : <Button>Accept</Button>}</div>
        <div css={buttonBar.wrapper}>
          <div css={buttonBar.container}>
            {currentPage > 1 ? <Button>Previous</Button> : null}
            {currentPage === totalPages ? null : <Button>Next</Button>}
          </div>
        </div>
      </div>
    </FormModal>
  );
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
