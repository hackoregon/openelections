import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';
/** @jsx jsx */
import TextFieldMaterial from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormModal from '../../FormModal/FormModal';
import { getModalState, clearModal } from '../../../state/ducks/modal';
import Button from '../../Button/Button';
import {
  updateExpenditure,
  postExpenditureComment,
} from '../../../state/ducks/expenditures';
import { ExpenditureStatusEnum } from '../../../api/api';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

const complianceReasonStyle = css`
  word-break: break-word;
  max-width: 300px;
`;
const buttonContainer = css`
  display: flex;
  margin-top: 30px;
  button {
    margin: 10px;
  }
`;
const complianceReasonTitle = css`
  font-size: 24px;
`;

const ComplianceReason = ({
  id,
  clearModal,
  updateExpenditure,
  postExpenditureComment,
}) => {
  const classes = useStyles();
  const isRequired = true;
  const [reasonPicked, setValue] = React.useState('overLimit');
  const [reasonText, setText] = React.useState('');
  function handleChange(event) {
    setValue(event.target.value);
  }
  function handleTextChange(event) {
    setText(event.target.value);
  }

  return (
    <FormModal>
      <div css={complianceReasonStyle}>
        <h1 css={complianceReasonTitle}>Out of Compliance</h1>
        <p>Choose Reason</p>
        <FormControl component="fieldset" className={classes.formControl}>
          <RadioGroup
            value={reasonPicked}
            aria-label="compliance"
            name="Compliance"
            onChange={event => {
              handleChange(event);
              setText(event.target.value);
            }}
          >
            <FormControlLabel
              value="Over Limit"
              control={<Radio color="default" />}
              label="Over Limit"
            />
            <FormControlLabel
              value="Other Reason"
              control={<Radio color="default" />}
              label="Other Reason"
            />
          </RadioGroup>
        </FormControl>
        <p>Please explain:</p>
        <TextFieldMaterial
          required={isRequired}
          id="comment"
          name="complianceReason"
          value={reasonText}
          label="Reason"
          onChange={handleTextChange}
          helperText="Enter a reason"
          autoComplete="on"
          fullWidth
        />
        <div css={buttonContainer}>
          <Button buttonType="formDefaultOutlined" onClick={() => clearModal()}>
            Cancel
          </Button>
          <Button
            disabled={!!(!reasonPicked || !reasonText)}
            buttonType="complianceDisabled"
            onClick={() => {
              clearModal();
              updateExpenditure({
                id,
                status: ExpenditureStatusEnum.OUT_OF_COMPLIANCE,
              });
              postExpenditureComment(id, reasonText);
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </FormModal>
  );
};

export default connect(
  state => ({
    getModalState: getModalState(state),
  }),
  dispatch => {
    return {
      updateExpenditure: data => dispatch(updateExpenditure(data)),
      postExpenditureComment: (id, comment) =>
        dispatch(postExpenditureComment(id, comment)),
      clearModal: () => dispatch(clearModal()),
    };
  }
)(ComplianceReason);
