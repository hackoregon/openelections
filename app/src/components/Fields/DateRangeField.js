import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { css, jsx } from '@emotion/core';
import { format } from 'date-fns';
import DateField from './DateField';

/** @jsx jsx */
import { accents } from '../../assets/styles/variables';

const hack = css`
  display: none !important;
`;

const helperTextStyles = css`
  color: rgba(0, 0, 0, 0.54);
  margin: 0;
  font-size: 0.75rem;
  margin-top: 8px;
  min-height: 1em;
  text-align: left;
  font-weight: 400;
  line-height: 1em;
  letter-spacing: 0.03333em;

  &.Mui-disabled {
    color: rgba(0, 0, 0, 0.38);
  }
  &.Mui-error {
    color: #f44336;
  }
`;

export default function DateRangeField(props) {
  const { formik, label, id, isRequired } = props;

  function renderSelectValue(value) {
    if (value && (value.to || value.from)) {
      return `${value.from ? formatISODate(value.from) : 'All dates'} to 
      ${value.to ? formatISODate(value.to) : 'All dates'}`;
    }
    return 'All dates';
  }

  function onDateRangeChange(newDateRange) {
    formik.setFieldValue(id, newDateRange);
    formik.setFieldTouched(id, true);
  }

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={id} required={isRequired}>
        {label}
      </InputLabel>
      <Select
        value={formik.values[id]}
        renderValue={renderSelectValue}
        displayEmpty
        error={formik.touched[id] && Boolean(formik.errors[id])}
        autoWidth
      >
        <MenuItem css={hack} />
        <Popover
          rangeValues={formik.values[id]}
          onDateRangeChange={onDateRangeChange}
          formik={formik}
        />
      </Select>
      {formik.errors[id] && formik.touched[id] && (
        <div
          css={helperTextStyles}
          className="MuiFormHelperText-root Mui-error"
        >
          {formik.errors[id]}
        </div>
      )}
    </FormControl>
  );
}

const popoverStyles = css`
  padding: 0;
  margin-top: -8px;

  .MuiTabs-indicator {
    background-color: ${accents.green};
  }

  .tab-content {
    padding: 10px;
  }

  .spacer {
    height: 20px;
  }
`;

DateRangeField.propTypes = {
  isRequired: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  formik: PropTypes.shape({}),
};

function Popover(props) {
  const { formik, onDateRangeChange, rangeValues } = props;

  /* eslint no-use-before-define:0 */
  const [from, setFrom] = useState(setupInitialState(rangeValues).from);
  const [to, setTo] = useState(setupInitialState(rangeValues).to);

  function setupInitialState(rangeValue) {
    return {
      from: rangeValue.from ? formatISODate(rangeValue.from, 'YYYY-MM-DD') : '',
      to: rangeValue.to ? formatISODate(rangeValue.to, 'YYYY-MM-DD') : '',
    };
  }

  function formatFieldValue(range) {
    const result = {
      from: '',
      to: '',
    };

    if (range.from) {
      result.from = getISOFromDate(range.from);
    }

    if (range.to) {
      result.to = getISOFromDate(range.to);
    }

    return result;
  }

  function handleDateTimeChange(event) {
    const elementId = event.target.id;
    const { value } = event.target;

    const range = {
      from,
      to,
    };

    // eslint-disable-next-line default-case
    switch (elementId) {
      case 'from-date':
        range.from = value;
        setFrom(value);
        break;
      case 'to-date':
        range.to = value;
        setTo(value);
        break;
    }

    if (event.type === 'blur') {
      onDateRangeChange(formatFieldValue(range));
    }
  }

  return (
    <div css={popoverStyles}>
      <div className="tab-content">
        <DateField
          picker="true"
          label="From"
          id="from-date"
          formik={formik}
          onChange={handleDateTimeChange}
          onBlur={handleDateTimeChange}
          value={from}
        />
        <div className="spacer" />
        <DateField
          picker="true"
          label="To"
          formik={formik}
          id="to-date"
          onChange={handleDateTimeChange}
          onBlur={handleDateTimeChange}
          value={to}
        />
      </div>
    </div>
  );
}

Popover.propTypes = {
  onDateRangeChange: PropTypes.func,
  rangeValues: PropTypes.shape({}),
  formik: PropTypes.shape({}),
};

function getISOFromDate(date) {
  const theDate = new Date(date);
  theDate.setTime(theDate.getTime() + theDate.getTimezoneOffset() * 60000);
  return theDate.toISOString();
}

function formatISODate(ISODate, theFormat) {
  return format(new Date(ISODate), theFormat || 'MM-DD-YYYY');
}
