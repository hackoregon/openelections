import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../Form/Form';
import {
  fields,
  FormSectionEnum,
  validate,
} from '../../../Pages/Portal/Expenses/ExpendituresFields';

const ExpensesDetailForm = ({ initialValues, onSubmit, children }) => (
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

export default ExpensesDetailForm;

ExpensesDetailForm.propTypes = {
  initialValues: PropTypes.oneOfType([PropTypes.object]),
  onSubmit: PropTypes.func,
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};
