import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";

const submitHandler = (values, formikBag) => {
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
};

class Form extends React.Component {
  render() {
    const { fields, initialValues, children } = this.props;
    const fieldIds = Object.keys(fields);
    const validations = Object.fromEntries(fieldIds.map(id => [id, fields[id].validation]));
    const validationSchema = Yup.object(validations);
    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={submitHandler}
        render={formikProps => {
          const form = (
            <React.Fragment>
              {Object.keys(fields).map(id =>
                React.createElement(fields[id].component, {
                  id,
                  label: fields[id].label,
                  formik: formikProps
                })
              )}
            </React.Fragment>
          );

          return children({
            form,
            isValid: formikProps.isValid,
            isDirty: formikProps.dirty,
            isSubmitting: formikProps.isSubmitting,
            handleSubmit: formikProps.handleSubmit,
            handleCancel: formikProps.handleReset
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
      validation: PropTypes.shape({/* Yup validation */})
    })
  ).isRequired,
  initialValues: PropTypes.shape({}).isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired
};

export default Form;