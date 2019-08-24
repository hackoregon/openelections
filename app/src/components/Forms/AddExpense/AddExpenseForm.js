import React from 'react';
import Form from '../../Form/Form';
import {
  fields,
  FormSectionEnum,
  // validate,
} from '../../../Pages/Portal/Expenses/ExpendituresFields';

const AddExpenseForm = ({ initialValues, onSubmit, children }) => (
  <>
    <Form
      // validate={validate}
      fields={fields}
      sections={[
        FormSectionEnum.AddHeaderSection,
        FormSectionEnum.BasicsSection,
        FormSectionEnum.PayeeInfoSection,
      ]}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {children}
    </Form>
  </>
);
export default AddExpenseForm;
