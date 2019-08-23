import React from 'react';
import * as Yup from 'yup';

import Form from '../../Form/Form';
import Fields from '../../../Pages/Portal/Expenses/ExpendituresFields';

const AddExpenseForm = ({ initialValues, onSubmit, children, fields }) => (
  <>
    <Form
      fields={fields}
      sections={['sectionOne', 'sectionTwo', 'sectionThree']}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {children}
    </Form>
  </>
);

export default AddExpenseForm;
