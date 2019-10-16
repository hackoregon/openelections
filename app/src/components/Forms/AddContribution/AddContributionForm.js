import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../Form/Form';
import {
  fields,
  FormSectionEnum,
  validate,
} from '../../../Pages/Portal/Contributions/Utils/ContributionsFields';

const AddContributionForm = ({ initialValues, onSubmit, children }) => (
  <Form
    validate={validate}
    fields={fields}
    sections={[FormSectionEnum.BASIC, FormSectionEnum.CONTRIBUTOR]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);
export default AddContributionForm;

AddContributionForm.propTypes = {
  initialValues: PropTypes.oneOfType([PropTypes.object]),
  onSubmit: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.any]),
};
