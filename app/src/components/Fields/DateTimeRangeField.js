import React from 'react';
import PropTypes, { func } from 'prop-types';
import {
  makeStyles,
  AppBar,
  Tabs,
  Tab,
  Select,
  MenuItem,
} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { css, jsx } from '@emotion/core';
import DateField from './DateField';
import TimeField from './TimeField';

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

export default function DateTimeRangeField(props) {
  const { formik, label, id, isRequired } = props;

  function renderSelectValue(value) {
    if (value && (value.to || value.from)) {
      return `${
        value.from ? extractTimeAndDateForDisplay(value.from).date : 'All dates'
      } to ${
        value.to ? extractTimeAndDateForDisplay(value.to).date : 'All dates'
      }`;
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
    background-color: ${accents.purple};
  }

  .tab-content {
    padding: 10px;
  }

  .spacer {
    height: 20px;
  }
`;

function Popover(props) {
  const { formik, onDateRangeChange, rangeValues } = props;
  const [tab, setTab] = React.useState(0);

  /* eslint no-use-before-define:0 */
  const { dateFrom, timeFrom, dateTo, timeTo } = setupInitialState(rangeValues);

  function setupInitialState(rangeValue) {
    const result = {
      dateFrom: '',
      timeFrom: '',
      dateTo: '',
      timeTo: '',
    };
    if (rangeValue.from) {
      const { date: dateFrom, time: timeFrom } = extractTimeAndDate(
        rangeValue.from
      );
      result.dateFrom = dateFrom;
      result.timeFrom = timeFrom;
    }
    if (rangeValue.to) {
      const { date: dateTo, time: timeTo } = extractTimeAndDate(rangeValue.to);
      result.dateTo = dateTo;
      result.timeTo = timeTo;
    }
    return result;
  }

  function handleTabChange(event, newValue) {
    setTab(newValue);
  }

  function formatFieldValue(range) {
    const result = {
      from: '',
      to: '',
    };

    if (range.from.date) {
      const dateFrom = range.from.date;
      const [hourFrom, minFrom] = range.from.time.split(':');
      result.from = getISOFromDateAndTime(dateFrom, hourFrom, minFrom);
    }

    if (range.to.date) {
      const dateTo = range.to.date;
      const [hourTo, minTo] = range.to.time.split(':');
      result.to = getISOFromDateAndTime(dateTo, hourTo, minTo);
    }

    return result;
  }

  function getISOFromDateAndTime(date, hours, minutes) {
    const theDate = new Date(date);
    const extraTime =
      Number(hours) * 60 * 60 * 1000 + Number(minutes) * 60 * 1000;
    theDate.setTime(
      theDate.getTime() + theDate.getTimezoneOffset() * 60000 + extraTime
    );
    return theDate.toISOString();
  }
  function handleDateTimeChange(event) {
    const elementId = event.target.id;
    const { value } = event.target;

    const range = {
      from: {
        date: dateFrom,
        time: timeFrom || '00:00',
      },
      to: {
        date: dateTo,
        time: timeTo || '00:00',
      },
    };

    switch (elementId) {
      case 'from-date':
        range.from.date = value;
        break;
      case 'from-time':
        range.from.time = value;
        break;
      case 'to-date':
        range.to.date = value;
        break;
      case 'to-time':
        range.to.time = value;
        break;
    }

    onDateRangeChange(formatFieldValue(range));
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div css={popoverStyles}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="simple tabs example"
      >
        <Tab label="From" {...a11yProps(0)} />
        <Tab label="To" {...a11yProps(1)} />
      </Tabs>
      <div className="tab-content" hidden={tab !== 0}>
        <DateField
          picker="true"
          label="Date"
          id="from-date"
          formik={formik}
          onChange={handleDateTimeChange}
          value={dateFrom}
        />
        <div className="spacer" />
        <TimeField
          picker="true"
          label="Time"
          formik={formik}
          id="from-time"
          onChange={handleDateTimeChange}
          value={timeFrom}
        />
      </div>
      <div className="tab-content" hidden={tab !== 1}>
        <DateField
          picker="true"
          label="Date"
          formik={formik}
          id="to-date"
          onChange={handleDateTimeChange}
          value={dateTo}
        />
        <div className="spacer" />
        <TimeField
          piker="true"
          label="Time"
          formik={formik}
          id="to-time"
          onChange={handleDateTimeChange}
          value={timeTo}
        />
      </div>
    </div>
  );
}

function extractTimeAndDate(ISODate) {
  const dateObj = new Date(ISODate);

  return {
    date: `${dateObj.getFullYear()}-${addZero(
      dateObj.getMonth() + 1
    )}-${addZero(dateObj.getDate())}`,
    time: `${addZero(dateObj.getHours())}:${addZero(dateObj.getMinutes())}`,
  };
}

function extractTimeAndDateForDisplay(ISODate) {
  const dateObj = new Date(ISODate);

  return {
    date: `${addZero(dateObj.getMonth() + 1)}-${addZero(
      dateObj.getDate()
    )}-${dateObj.getFullYear()}`,
    time: `${addZero(dateObj.getHours())}:${addZero(dateObj.getMinutes())}`,
  };
}

function addZero(number) {
  return number.toString().padStart(2, '0');
}
