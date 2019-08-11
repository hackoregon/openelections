import React from 'react';
import PropTypes, { func } from 'prop-types';
import { makeStyles, AppBar, Tabs, Tab, Select, MenuItem } from '@material-ui/core';
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
import { accents } from "../../assets/styles/variables";

const hack = css`
    display: none !important;
`;

export default function DateRangeField (props) {
    const { formik, label, id } = props;

    const [dateTimeRangeValue, setDateTimeRangeValue] = React.useState({ from: '', to: '' });

    function renderSelectValue (value) {
        if (value.to && value.from) {
            const dateFromString = new Date(dateTimeRangeValue.from).toLocaleString('en-GB');
            const dateToString = new Date(dateTimeRangeValue.to).toLocaleString('en-GB');

            return dateFromString + ' - ' + dateToString;
        } else {
            return 'All dates';
        }
    }

    function onDateRangeChange (newDateRange) {
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
                <MenuItem css={hack}></MenuItem>
                <Popover rangeValues={dateTimeRangeValue} onDateRangeChange={onDateRangeChange} formik={formik} />
            </Select>
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

function Popover (props) {
    const { formik, onDateRangeChange, rangeValues } = props;
    const [tab, setTab] = React.useState(0);


    const [dateFrom, setDateFrom] = React.useState('2019-9-10');
    const [timeFrom, setTimeFrom] = React.useState('00:00');
    const [dateTo, setDateTo] = React.useState('2019-11-10');
    const [timeTo, setTimeTo] = React.useState('00:00');

    const [timeDateRange, setTimeDateRange] = React.useState(rangeValues);

    function handleTabChange (event, newValue) {
        setTab(newValue);
    }

    function handleDateTimeChange (event) {
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

        if (dateFrom) {
            const dateFromObject = new Date(dateFrom);
            dateFromObject.setHours(Number(fromHour), Number(fromMinute));

            rangeFrom = dateFromObject.toISOString()
        }

        if (dateTo) {
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

    function a11yProps (index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    return (
        <div css={popoverStyles}>
            <Tabs value={tab} onChange={handleTabChange} aria-label="simple tabs example">
                <Tab label="From" {...a11yProps(0)} />
                <Tab label="To" {...a11yProps(1)} />
            </Tabs>
            <div className={'tab-content'} hidden={tab !== 0}>
                <DateField
                    label={'Date'}
                    id={`from-date`}
                    formik={formik}
                    onChange={handleDateTimeChange}
                />
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
                <TimeField label={'Time'}
                    formik={formik}
                    id={`to-time`}
                    onChange={handleDateTimeChange}
                    value={timeTo}

                />
            </div>
        </div>
    )
}

