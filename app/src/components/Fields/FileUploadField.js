/* eslint-disable react/prop-types */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { css, jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import TextFieldMaterial from '@material-ui/core/TextField';

const labelFormat = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FileUploadField = props => {
  const { id, label, formik, isRequired } = props;
  const inputValue = (formik.values[id] || {}).filename || '';

  return (
    <TextFieldMaterial
      required={isRequired}
      type="file"
      id={id}
      className="file-input"
      name={id}
      label={<span css={labelFormat}>{label}</span>}
      helperText={formik.touched[id] ? formik.errors[id] : ''}
      error={formik.touched[id] && Boolean(formik.errors[id])}
      value={inputValue}
      onChange={e => {
        if (e && e.target && e.target.files && e.target.files.length) {
          const file = e.target.files?.[0];
          file.filename = e.target.value;
          formik.setFieldValue(id, file);
          if (file === '') {
            formik.resetForm();
          }
        } else {
          formik.setFieldValue(id, '');
          formik.resetForm();
        }
      }}
      fullWidth
      style={{ display: 'flex' }}
      InputProps={{ disableUnderline: true }}
    />
  );
};

FileUploadField.propTypes = {
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  formik: PropTypes.shape({}),
};

export default FileUploadField;
