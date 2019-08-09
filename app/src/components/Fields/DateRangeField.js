import React from 'react';
import PropTypes, { func } from 'prop-types';
<<<<<<< HEAD
<<<<<<< HEAD
import { makeStyles, AppBar, Tabs, Tab, Select, MenuItem } from '@material-ui/core';
=======
import { makeStyles, AppBar, Tabs, Tab, Select } from '@material-ui/core';
>>>>>>> Created DateRange field and added to the contributions filter
=======
import { makeStyles, AppBar, Tabs, Tab, Select, MenuItem} from '@material-ui/core';
>>>>>>> WIP: DateRangeField
import DateField from "./DateField";
import TimeField from "./TimeField";
import Form from "../Form/Form";
import { FormSectionEnum } from "../../Pages/Portal/Contributions/Utils/ContributionsFields";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
<<<<<<< HEAD
<<<<<<< HEAD
import { accents } from "../../assets/styles/variables";
import TextFieldMaterial from "@material-ui/core/TextField/TextField";

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

export default function DateRangeField (props) {
    const { formik, label, id, isRequired } = props;

    const [dateTimeRangeValue, setDateTimeRangeValue] = React.useState(
        { from: { date: '', time: '00:00'}, to: { date: '', time: '00:00' } });

    function renderSelectValue (value) {
        if (value.to.date || value.from.date) {
            return (value.from.date || 'All dates') + ' to ' + (value.to.date || 'All dates');
        } else {
            return 'All dates';
        }
    }

    function formatFieldValue ( range ) {
        const result = {
            from: '',
            to: ''
        };

        if ( range.from.date ) {
            const dateFrom = new Date(range.from.date);
            const [hourFrom, minFrom] = range.from.time.split(":");
            dateFrom.setHours(hourFrom, minFrom);
            result.from = dateFrom.toISOString();
        }

        if ( range.to.date ) {
            const dateTo = new Date(range.to.date);
            const [hourTo, minTo] = range.to.time.split(":");
            dateTo.setHours(hourTo, minTo);
            result.to = dateTo.toISOString();
        }

        return result;
    }

    function onDateRangeChange (newDateRange) {
        setDateTimeRangeValue(newDateRange);
        
        formik.setFieldValue(id, formatFieldValue(newDateRange));
        formik.setFieldTouched(id, true);
    }

    return (
        <FormControl fullWidth>
            <InputLabel htmlFor={id} required={isRequired}>{label}</InputLabel>
            <Select
                value={dateTimeRangeValue}
                renderValue={renderSelectValue}
                displayEmpty={true}
                error={formik.touched[id] && Boolean(formik.errors[id])}
                autoWidth>
                <MenuItem css={hack}></MenuItem>
                <Popover rangeValues={dateTimeRangeValue} onDateRangeChange={onDateRangeChange} formik={formik} />
            </Select>
            {formik.errors[id] &&
            formik.touched[id] &&
            <div css={helperTextStyles} className="MuiFormHelperText-root Mui-error">
                {formik.errors[id]}
            </div>}
        </FormControl>
    );
=======
=======
import { accents } from "../../assets/styles/variables";
>>>>>>> WIP: DateRangeField


export default function DateRangeField(props) {
    const { formik, label, id } = props;

    const [dateTimeRangeValue, setDateTimeRangeValue] = React.useState({from: '', to: ''});

  function renderSelectValue (value) {
      if (value.to && value.from) {
          const dateFromString = new Date(dateTimeRangeValue.from).toLocaleString('en-GB');
          const dateToString = new Date(dateTimeRangeValue.to).toLocaleString('en-GB');

          return dateFromString + ' - ' + dateToString;
      } else {
          return 'All dates';
      }
  }
  
  function onDateRangeChange(newDateRange) {
      setDateTimeRangeValue(newDateRange);

      formik.setValues({
          [id]: newDateRange
      });
      formik.setTouched({
          [id]: true
      });
  }

  return (
      <FormControl fullWidth>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select
              value={dateTimeRangeValue}
              renderValue={renderSelectValue}
              displayEmpty={true}
              autoWidth>
              <Popover rangeValues={dateTimeRangeValue} onDateRangeChange={onDateRangeChange} formik={formik} />
          </Select>
      </FormControl>
  );
>>>>>>> Created DateRange field and added to the contributions filter
}

const popoverStyles = css`
  padding: 0;
  margin-top: -8px;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> WIP: DateRangeField
  
  .MuiTabs-indicator {
    background-color: ${accents.purple};
  }
  
<<<<<<< HEAD
=======
>>>>>>> Created DateRange field and added to the contributions filter
=======
>>>>>>> WIP: DateRangeField
  .tab-content {
    padding: 10px;
  }
  
  .spacer {
    height: 20px;
  }
`;

<<<<<<< HEAD
function Popover (props) {
    const { formik, onDateRangeChange, rangeValues } = props;
    const [tab, setTab] = React.useState(0);

    const { dateFrom, timeFrom, dateTo, timeTo } =  setupInitialState( rangeValues );

    function handleTabChange (event, newValue) {
        setTab(newValue);
    }

    function setupInitialState(rangeValue) {
        return {
            dateFrom: rangeValue.from.date,
            timeFrom:rangeValue.from.time,
            dateTo: rangeValue.to.date,
            timeTo: rangeValue.to.time
        }
    }

    function handleDateTimeChange (event) {
        const elementId = event.target.id;
        const value = event.target.value;

        const range = rangeValues;

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

        onDateRangeChange(range);
    }

    function a11yProps (index) {
=======
function Popover(props) {
    const {formik, onDateRangeChange, rangeValues} = props;
    const [tab, setTab] = React.useState(0);


    const [dateFrom, setDateFrom] = React.useState('2019-9-10');
    const [timeFrom, setTimeFrom] = React.useState('00:00');
    const [dateTo, setDateTo] = React.useState('2019-11-10');
    const [timeTo, setTimeTo] = React.useState('00:00');

    const [timeDateRange, setTimeDateRange] = React.useState(rangeValues);

    function handleTabChange(event, newValue) {
        setTab(newValue);
    }

    function handleDateTimeChange(event) {
        const elementId = event.target.id;
        const value = event.target.value;

        switch (elementId) {
            case 'from-date': setDateFrom(value); break;
            case 'from-time': setTimeFrom(value); break;
            case 'to-date': setDateTo(value); break;
            case 'to-time': setTimeTo(value); break;
        }

        const [fromHour, fromMinute] = timeFrom.split(':');
        const [toHour, toMinute] = timeFrom.split(':');

        let rangeFrom, rangeTo = '';

        if ( dateFrom ) {
            const dateFromObject = new Date(dateFrom);
            dateFromObject.setHours(Number(fromHour), Number(fromMinute));

            rangeFrom = dateFromObject.toISOString()
        }

        if ( dateTo ) {
            const dateToObject = new Date(dateTo);
            dateToObject.setHours(Number(toHour), Number(toMinute));

            rangeTo = dateToObject.toISOString()
        }

        const range = {
            from: rangeFrom,
            to: rangeTo
        };

        setTimeDateRange(range);
        onDateRangeChange(range);
    }

    function a11yProps(index) {
>>>>>>> Created DateRange field and added to the contributions filter
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
<<<<<<< HEAD

    return (
        <div css={popoverStyles}>
            <Tabs value={tab} onChange={handleTabChange} aria-label="simple tabs example">
=======
    return (
        <div css={popoverStyles}>
<<<<<<< HEAD
            <Tabs value={tab} onChange={handleChange} aria-label="simple tabs example">
>>>>>>> Created DateRange field and added to the contributions filter
=======
            <Tabs value={tab} onChange={handleTabChange} aria-label="simple tabs example">
>>>>>>> WIP: DateRangeField
                <Tab label="From" {...a11yProps(0)} />
                <Tab label="To" {...a11yProps(1)} />
            </Tabs>
            <div className={'tab-content'} hidden={tab !== 0}>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> WIP: DateRangeField
                <DateField
                    label={'Date'}
                    id={`from-date`}
                    formik={formik}
                    onChange={handleDateTimeChange}
<<<<<<< HEAD
                    value={dateFrom}
                />
                <div className={'spacer'}></div>
                <TimeField label={'Time'}
                    formik={formik}
                    id={`from-time`}
                    onChange={handleDateTimeChange}
                    value={timeFrom}
                />
            </div>
            <div className={'tab-content'} hidden={tab !== 1}>
                <DateField label={'Date'} formik={formik} id={`to-date`}
                    onChange={handleDateTimeChange}
                           value={dateTo}
                />
                <div className={'spacer'}></div>
                <TimeField label={'Time'}
                    formik={formik}
                    id={`to-time`}
                    onChange={handleDateTimeChange}
                    value={timeTo}

                />
=======
                <DateField label={'Date'} formik={formik} id={`from-date`}/>
=======
                />
>>>>>>> WIP: DateRangeField
                <div className={'spacer'}></div>
                <TimeField label={'Time'}
                           formik={formik}
                           id={`form-time`}
                           onChange={handleDateTimeChange}
                           value={timeFrom}
                />
            </div>
            <div className={'tab-content'} hidden={tab !== 1}>
                <DateField label={'Date'} formik={formik} id={`to-date`}
                           onChange={handleDateTimeChange}
                />
                <div className={'spacer'}></div>
<<<<<<< HEAD
                <TimeField label={'Time'} formik={formik} id={`to-time`}/>
>>>>>>> Created DateRange field and added to the contributions filter
=======
                <TimeField label={'Time'}
                           formik={formik}
                           id={`to-time`}
                           onChange={handleDateTimeChange}
                           value={timeTo}

                />
>>>>>>> WIP: DateRangeField
            </div>
        </div>
    )
}
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> Created DateRange field and added to the contributions filter
=======

>>>>>>> WIP: DateRangeField
