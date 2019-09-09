import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function RadioButtonsGroup() {
  const classes = useStyles();
  const [value, setValue] = React.useState('female');

  function handleChange(event) {
    setValue(event.target.value);
  }
  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
        <RadioGroup
          aria-label="compliance"
          name="Compliance"
          value={value}
          onChange={handleChange}
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
}
