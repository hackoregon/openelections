import React from 'react';
import Form from '../../Form/Form';
import {
  validate,
  fields,
  FormSectionEnum,
} from '../../../Pages/Portal/Expenses/ExpendituresFields';

const ExpenditureReadyForm = ({ initialValues, onSubmit, children }) => (
  <Form
    validate={validate}
    fields={fields}
    sections={[FormSectionEnum.BASIC, FormSectionEnum.PAYEE_INFO]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);
export default ExpenditureReadyForm;
