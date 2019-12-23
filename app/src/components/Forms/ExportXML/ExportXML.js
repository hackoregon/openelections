import React from 'react';
import * as Yup from 'yup';
import Form from '../../Form/Form';
import TextField from '../../Fields/TextField';

const fields = {
  filerId: {
    label: 'Filer Id',
    section: 'export',
    component: TextField,
    validation: Yup.number('Enter your Filer Id').required(
      'Filer Id is required'
    ),
  },
};

const ExportXMLForm = ({ initialValues, onSubmit, children }) => (
  <Form
    fields={fields}
    sections={['export']}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

export default ExportXMLForm;
