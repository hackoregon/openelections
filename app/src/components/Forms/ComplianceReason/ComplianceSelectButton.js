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
import { ExpenditureStatusEnum } from '../../../api/api';
import { updateExpenditure } from '../../../state/ducks/expenditures';
import { showModal } from '../../../state/ducks/modal';

const options = [
  'Select Compliance',
  'Draft',
  'Submitted',
  'Out of Compliance',
  'In Compliance',
];

const SplitButton = ({ id, updateExpenditure, showModal }) => {
  // const SplitButton = ({ id, updateExpenditure, showModal }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  //   Hook it up to the expenditure update duck, with the status field populated. - KELLY
  function updateStatus(index) {
    console.log(index, id);
    let value = null;
    switch (options[index]) {
      case 'Draft':
        value = ExpenditureStatusEnum.DRAFT;
        updateExpenditure({ id, status: value });
        // alert(`You clicked ${options[selectedIndex]}`);
        break;
      case 'Submitted':
        value = ExpenditureStatusEnum.SUBMITTED;
        alert(`You clicked ${options[selectedIndex]}`);
        break;
      case 'Out of Compliance':
        value = ExpenditureStatusEnum.OUT_OF_COMPLIANCE;
        showModal({
          component: 'ComplianceReason',
          props: { id },
        });
        // alert(
        //   `The modal should pop up because you clicked ${options[selectedIndex]}`
        // );
        break;
      case 'In Compliance':
        value = ExpenditureStatusEnum.IN_COMPLIANCE;
        alert(`You clicked ${options[selectedIndex]}`);
        break;
      default:
        alert('Nothing Happens');
    }
    return value;
  }

  function handleClick(event) {
    console.log('No clicking');
  }
  function handleMenuItemClick(event, index) {
    setSelectedIndex(index);
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
    </Grid>
  );
};

function SplitButtony(props) {
  const { id, updateExpenditure, showModal } = props;
  return (
    <SplitButton
      id={id}
      updateExpenditure={updateExpenditure}
      showModal={showModal}
    />
  );
}

export default connect(
  state => ({}),
  dispatch => {
    return {
      updateExpenditure: data => dispatch(updateExpenditure(data)),
      showModal: data => dispatch(showModal(data)),
    };
  }
)(SplitButtony);
