import React from 'react';
import * as Yup from 'yup';

import Form from '../../Form/Form';
import {
  HeaderSection,
  BasicsSection,
  PayeeInfoSection,
} from '../../../Pages/Portal/Expenses/ExpendituresSections';
import {
  fields,
  // FormSectionEnum,
  // validate,
} from '../../../Pages/Portal/Expenses/ExpendituresFields';

const AddExpenseForm = ({ initialValues, onSubmit, children }) => (
  <>
    <Form
      fields={fields}
      sections={[HeaderSection, BasicsSection, PayeeInfoSection]}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {children}
    </Form>
  </>
);

export default AddExpenseForm;
