  // This is a work around to be able to
  // encapsulate attaching state handling
  // upon submission within the form.
  
export const submitHandler = (values, formikBag) => {
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
