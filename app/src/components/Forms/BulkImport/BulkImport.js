import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Form from '../../Form/Form';
import FileUploadField from '../../Fields/FileUploadField';

function isValidFileType(value) {
  return value && value.type === 'text/csv';
}

function isValidFileSize(value) {
  return value && value.size <= 500000; // 500KB
}

const BulkImportForm = ({ initialValues, onSubmit, onValidate, children }) => {
  const fields = {
    fileUpload: {
      label: 'File Upload',
      section: 'fileUpload',
      component: FileUploadField,
      validation: Yup.mixed('Upload your CSV File here')
        .required('CSV file is required')
        .test('is-valid-type', 'Not a valid file type', isValidFileType)
        .test('is-valid-size', 'Max allowed size is 500KB', isValidFileSize)
        .test('reset-aux-errors', 'Clear auxiliary errors', () => {
          onValidate();
          return true;
        }),
    },
  };
  return (
    <Form
      fields={fields}
      sections={['fileUpload']}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {children}
    </Form>
  );
};

BulkImportForm.propTypes = {
  initialValues: PropTypes.shape({}),
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func,
  children: PropTypes.node,
};

export default BulkImportForm;
