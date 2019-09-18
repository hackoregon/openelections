import React from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ContributionStatusEnum } from '../../../api/api';
import { updateContribution } from '../../../state/ducks/contributions';
import { showModal, modalIsActive } from '../../../state/ducks/modal';

const SplitButton = ({
  id,
  updateContribution,
  showModal,
  modalIsActive,
  donationAmount,
  showMatchOption,
}) => {
  console.log('before: ', showMatchOption);
  const [open, setOpen] = React.useState(false);
  let options;
  if (showMatchOption === 'hide') {
    options = [
      'Select Status',
      'Archived',
      'Draft',
      'Processed',
      'Submitted',
      'Out of Compliance',
      'In Compliance',
    ];
  }
  if (showMatchOption === 'show') {
    options = [
      'Select Status',
      'Archived',
      'Draft',
      'Processed',
      'Submitted',
      'Out of Compliance',
      'In Compliance',
      'Match Contribution',
    ];
  }

  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isSubmitting, setSubmitting] = React.useState(false);

  console.log('after: ', showMatchOption);

  function updateStatus(index) {
    let value = null;
    switch (options[index]) {
      case 'Match Contribution':
        value = ContributionStatusEnum.PROCESSED;
        showModal({
          component: 'MatchContribution',
          props: { id, donationAmount, showMatchOption },
        });
        setSubmitting(false);
        break;
      case 'Archived':
        value = ContributionStatusEnum.ARCHIVED;
        updateContribution({ id, status: value });
        break;
      case 'Draft':
        value = ContributionStatusEnum.DRAFT;
        updateContribution({ id, status: value });
        break;
      case 'Processed':
        value = ContributionStatusEnum.PROCESSED;
        updateContribution({ id, status: value });
        break;
      case 'Submitted':
        value = ContributionStatusEnum.SUBMITTED;
        updateContribution({ id, status: value });
        break;
      case 'Out of Compliance':
        value = ContributionStatusEnum.OUT_OF_COMPLIANCE;
        showModal({
          component: 'ComplianceReason',
          props: { id },
        });
        setSubmitting(false);
        break;
      case 'In Compliance':
        value = ContributionStatusEnum.IN_COMPLIANCE;
        updateContribution({ id, status: value });
        break;
      default:
        setSubmitting(false);
    }
    return value;
  }

  function handleClick(event) {
    setOpen(true);
  }
  function handleMenuItemClick(event, index) {
    setSubmitting(true);
    setOpen(false);
    updateStatus(index);
  }

  function handleToggle() {
    setOpen(prevOpen => !prevOpen);
  }

  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }

  return (
    <Grid container>
      {!isSubmitting && !modalIsActive ? (
        <Grid item xs={12} align="center">
          <ButtonGroup
            variant="contained"
            color="primary"
            ref={anchorRef}
            aria-label="split button"
          >
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
            <Button
              color="primary"
              size="small"
              aria-owns={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper id="menu-list-grow">
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={index === selectedIndex}
                          onClick={event => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
};

function MatchContributionSelector(props) {
  const {
    id,
    updateContribution,
    showModal,
    modalIsActive,
    donationAmount,
    showMatchOption,
  } = props;
  return (
    <SplitButton
      id={id}
      updateContribution={updateContribution}
      showModal={showModal}
      modalIsActive={modalIsActive}
      donationAmount={donationAmount}
      showMatchOption={showMatchOption}
    />
  );
}

export default connect(
  state => ({
    modalIsActive: modalIsActive(state),
  }),
  dispatch => {
    return {
      updateContribution: data => dispatch(updateContribution(data)),
      showModal: data => dispatch(showModal(data)),
    };
  }
)(MatchContributionSelector);
