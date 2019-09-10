import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

const ComplianceRadioButtons = () => {
  const classes = useStyles();

  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
        <RadioGroup
          aria-label="compliance"
          name="Compliance"
          value="compliance"
          onChange={console.log('hi')}
        >
          <FormControlLabel
            value="overLimit"
            control={<Radio color="default" />}
            label="Over Limit"
          />
          <FormControlLabel
            value="other"
            control={<Radio color="default" />}
            label="Other Reason"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default ComplianceRadioButtons;
