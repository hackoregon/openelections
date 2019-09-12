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
import { ExpenditureStatusEnum } from '../../../api/api';
import { updateExpenditure } from '../../../state/ducks/expenditures';
import { showModal, modalIsActive } from '../../../state/ducks/modal';

const options = [
  'Select Compliance',
  'Draft',
  'Submitted',
  'Out of Compliance',
  'In Compliance',
];

const SplitButton = ({ id, updateExpenditure, showModal, modalIsActive }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isSubmitting, setSubmitting] = React.useState(false);

  function updateStatus(index) {
    let value = null;
    switch (options[index]) {
      case 'Draft':
        value = ExpenditureStatusEnum.DRAFT;
        updateExpenditure({ id, status: value });
        break;
      case 'Submitted':
        value = ExpenditureStatusEnum.SUBMITTED;
        updateExpenditure({ id, status: value });
        break;
      case 'Out of Compliance':
        value = ExpenditureStatusEnum.OUT_OF_COMPLIANCE;
        showModal({
          component: 'ComplianceReason',
          props: { id },
        });
        setSubmitting(false);
        break;
      case 'In Compliance':
        value = ExpenditureStatusEnum.IN_COMPLIANCE;
        updateExpenditure({ id, status: value });
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

function ComplianceSelectButton(props) {
  const { id, updateExpenditure, showModal, modalIsActive } = props;
  return (
    <SplitButton
      id={id}
      updateExpenditure={updateExpenditure}
      showModal={showModal}
      modalIsActive={modalIsActive}
    />
  );
}

export default connect(
  state => ({
    modalIsActive: modalIsActive(state),
  }),
  dispatch => {
    return {
      updateExpenditure: data => dispatch(updateExpenditure(data)),
      showModal: data => dispatch(showModal(data)),
    };
  }
)(ComplianceSelectButton);
