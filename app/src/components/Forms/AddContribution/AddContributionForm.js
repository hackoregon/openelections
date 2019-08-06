import React from "react";
import Form from "../../Form/Form";
import {
  fields,
  FormSectionEnum,
  validate
} from '../../../Pages/Portal/Contributions/Utils/ContributionsFields';

const AddContributionForm = ({ initialValues, onSubmit, children }) => (
  <Form
    validate={validate}
    fields={fields}
    sections={[FormSectionEnum.BASIC, FormSectionEnum.CONTRIBUTOR, FormSectionEnum.OTHER_DETAILS]}
    initialValues={initialValues}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);
export default AddContributionForm;
