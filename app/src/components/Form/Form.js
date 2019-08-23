import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';

export const formFromFields = (fields, formikProps, dynamicRequire) =>
  Object.keys(fields).map(id =>
    React.createElement(fields[id].component, {
      key: id,
      id,
      label: fields[id].label,
      options: { ...fields[id].options },
      formik: formikProps,
      isRequired: !!(
        dynamicRequire[id] ||
        _.get(fields[id], 'validation._exclusive.required')
      ),
    })
  );

function removeVisibleIfFromErrorObject(errorObject) {
  return _.pick(errorObject, ['error']);
}

class Form extends React.Component {
  render() {
    const { fields, initialValues, sections, children, validate } = this.props;
    const fieldIds = Object.keys(fields);
    const validations = Object.fromEntries(
      fieldIds.map(id => [id, fields[id].validation])
    );
    const validationSchema = Yup.object(validations);
    return (
      <Formik
        validate={
          validate
            ? values => removeVisibleIfFromErrorObject(validate(values))
            : null
        }
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, formikBag) => {
          // This is a work around to be able to encapsulate
          // attaching state handling upon submission within the form.
          const addHandlers = promise =>
            promise.then(
              result => {
                formikBag.resetForm();
                formikBag.setSubmitting(false);
                return result;
              },
              error => {
                formikBag.setSubmitting(false);
                formikBag.setErrors(error.validationErrors);
                throw error;
              }
            );
          return this.props.onSubmit(values, addHandlers);
        }}
        render={formikProps => {
          const dynamicRequire = validate ? validate(formikProps.values) : {};
          const visibleIf = dynamicRequire._visibleIf
            ? dynamicRequire._visibleIf
            : {};
          const form = (
            <>{formFromFields(fields, formikProps, dynamicRequire)}</>
          );
          const formSections =
            sections && sections.length > 0
              ? Object.fromEntries(
                  sections.map(section => [
                    section,
                    <>
                      {formFromFields(
                        _.pickBy(fields, field => field.section === section),
                        formikProps,
                        dynamicRequire
                      )}
                    </>,
                  ])
                )
              : {};
          const formFields =
            fieldIds && fieldIds.length > 0
              ? Object.fromEntries(
                  fieldIds.map(id => [
                    id,
                    <>
                      {formFromFields(
                        _.pick(fields, id),
                        formikProps,
                        dynamicRequire
                      )}
                    </>,
                  ])
                )
              : {};
          return children({
            form,
            formSections,
            formFields,
            isValid: formikProps.isValid,
            isDirty: formikProps.dirty,
            isSubmitting: formikProps.isSubmitting,
            handleSubmit: formikProps.handleSubmit,
            handleCancel: formikProps.handleReset,
            values: formikProps.values,
            visibleIf,
            formErrors: formikProps.errors,
            /* could return more formikProps if needed */
          });
        }}
      />
    );
  }
}

Form.propTypes = {
  fields: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string,
      component: PropTypes.component,
      validation: PropTypes.shape({
        /* Yup validation */
      }),
      // sections: PropTypes.arrayOf(PropTypes.string) <- optional
    })
  ).isRequired,
  initialValues: PropTypes.shape({}).isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  validate: PropTypes.func,
};

export default Form;
