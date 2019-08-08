import React from 'react';
import PropTypes, { func } from 'prop-types';
import { makeStyles, AppBar, Tabs, Tab, Select } from '@material-ui/core';
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


export default function SimpleTabs(props) {
    const { formik, label, id } = props;
  const [selectValue, setSelectValue] = React.useState('Current Campaign');

  function renderSelectValue () {
      return selectValue;
  }

  return (
      <>
      <FormControl fullWidth>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select
              value={selectValue}
              renderValue={renderSelectValue}
              displayEmpty={true}
              autoWidth>
              <Popover formik={formik} />
          </Select>
      </FormControl>
          </>
  );
}

const popoverStyles = css`
  padding: 0;
  margin-top: -8px;
  .tab-content {
    padding: 10px;
  }
  
  .spacer {
    height: 20px;
  }
`;

function Popover(props) {
    const {formik} = props;
    const [tab, setTab] = React.useState(0);

    function handleChange(event, newValue) {
        setTab(newValue);
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    return (
        <div css={popoverStyles}>
            <Tabs value={tab} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="From" {...a11yProps(0)} />
                <Tab label="To" {...a11yProps(1)} />
            </Tabs>
            <div className={'tab-content'} hidden={tab !== 0}>
                <DateField label={'Date'} formik={formik} id={`from-date`}/>
                <div className={'spacer'}></div>
                <TimeField label={'Time'} formik={formik} id={`form-time`}/>
            </div>
            <div className={'tab-content'} hidden={tab !== 1}>
                <DateField label={'Date'} formik={formik} id={`to-date`}/>
                <div className={'spacer'}></div>
                <TimeField label={'Time'} formik={formik} id={`to-time`}/>
            </div>
        </div>
    )
}
