import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

/**
 * Returns a form field object that will by optional by the form during submission (unless handled by a validate() function).
 * Optionally, a `values` string array can be passed in for components that accept a `values` field in it's `options`.
 * @param {string} label
 * @param {string} section
 * @param {React.Component} component
 * @param {*} validation
 * @param {string[]} values
 */
export const formField = (
  label,
  section,
  component,
  validation,
  values = undefined
) =>
  values
    ? { label, section, component, validation, options: { values } }
    : { label, section, component, validation };

/**
 * Returns a form field object that will be required by the form during submission.
 * Optionally, a `values` string array can be passed in for components that accept a `values` field in it's `options`.
 * @param {string} label
 * @param {string} section
 * @param {React.Component} component
 * @param {*} validation
 * @param {string} requiredMessage
 * @param {string[]} values
 */

export const requiredFormField = (
  label,
  section,
  component,
  validation,
  requiredMessage,
  values = undefined
) => {
  // validation = validation.required(requiredMessage);
  return values
    ? { label, section, component, validation, options: { values } }
    : { label, section, component, validation };
};

/**
 * Returns a function that checks all passed in params against a function.
 * @param {*} func
 */
const checkAllParams = func => (...args) => args.every(x => func(x));

/**
 * Accepts a variable number of string parameters, and check if all parameters are not the empty string.
 * @returns {boolean} true if all parameters are not empty, and false if one of them is.
 */
export const checkNoEmptyString = checkAllParams(x => x !== '');

/**
 * A higher order component that accepts two forms of options and a boolean function which determines which of the options
 * are passed to the component.
 */
export const DynamicOptionField = ({
  Component,
  props,
  check,
  trueOptions,
  falseOptions,
}) => <Component {...props} options={check ? trueOptions : falseOptions} />;

/**
 * Array of all string abbreviations of U.S. states.
 */
export const stateList = [
  'Foreign',
  'AK',
  'AL',
  'AR',
  'AS',
  'AZ',
  'CA',
  'CO',
  'CT',
  'DC',
  'DE',
  'FL',
  'GA',
  'GU',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'ND',
  'NC',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'OH',
  'OK',
  'OR',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VA',
  'VI',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
];
