# Small Donor Elections Frontend
(Previously Open Elections)

## Table of Contents

- [Quick start](#quick-start)
- [Adding Routes](#adding-routes)
- [Forms](#forms)

## Quick Start

The following commands are available in this project:
`npm install` or `npm --ignore-engines` if you get a node engine incompatibility

Install the necessary dependencies by running `npm i` in this directory.

### `npm run start`

This runs the app in development mode on port 4000.

### `npm run build`

This will build the app into a build directory.

### `npm run test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run storybook`

This starts up storybook on port 6006.

### `npm run build-storybook`

This will build your storybook app.

## Running the Front-End and Back-End together with seeded data

Run the following command from project root: `docker-compose up api` (`-d` for daemon)

- You will need to use `sudo` with this command as well, if you are developing with Linux
- If you encounter errors, run `docker-compose build api`

Make sure node_modules are installed locally for the project to properly build.

## Adding Routes

This project will have pages that are public facing that are not considered to be part of the "portal." In other words, pages like the `Home` page and `About` page will not be apart of the app, or Portal functionality. For this reason there are two routes for this project. The higher level router is located in the `./src/Pages/routes.js` file, and the Portal routes (the main part of this app) are located in the `./src/Pages/Portal/Portal.js` file.

### Adding Public Pages

To add public-facing pages, add the components in the `./src/Pages/routes.js` file. First:

```js
// routes.js
import HomePage from "./Home/Home";
```

Then add it to the Switch BEFORE the Route Component rendering the Portal Component:

```js
// routes.js
<Switch location={location}>
  <Route exact path="/" component={HomePage} />
  <Route component={Portal} />
</Switch>
```

### Adding Portal Pages

To add pages to the portal, first import the page component in the `./src/Pages/Portal/Portal.js` file:

```js
import DashboardPage from "./Dashboard/Dashboard";
```

Then add it to the Switch:

```js
<Switch location={location}>
  <Route exact path="/dashboard" component={DashboardPage} />
  <Route exact path="/contributions" component={ContributionsPage} />
</Switch>
```

## Forms

Forms can be very frustrating and and difficult to manage, so here is an attempt to find some standardization in the form creation process. Feel free to add and improve this process.

Our forms use three main technologies:
- [`Formik`](https://jaredpalmer.com/formik/) for form state management
- [`Yup`](https://github.com/jquense/yup) for validation schemas
- [`Material UI`](https://material-ui.com) for UI components

### File Structure

There are a few main goals with our form structure:
- separation of concerns: ui components, form state and validation, application state.
- create patterns that are easy to reason about, improve, and maintain

This choice was largely made because creating a form, valiation, & UI system could take a few Hack Oregon seasons and we are volunteers with a deadline 😅. So let's dig a little deeper into how the forms are set up.

The example below shows the structure for the ChangePassword form:
```
/components
--- /Fields
--- PasswordField.js <- Common field UI component

--- /Forms
--- ChangePasswordForm.js <- Specific form component (validation, fields)
--- Form.js <- Common Form component used in all Specific form components


/page
--- /ChangePassword
--- index.js <- Connected master component, 
--- ChangePassword.js <- Layout component containing modal, ChangePasswordForm, buttons, etc...
```

#### Specific form component

A specific form component defines fields and encapsulates the validation for a given form in an `fields` object. It only receives `initialValues`, an `onSubmit` handler, and `children`. All of this is passed into the common Form component.

Validation uses the [`Yup`](https://github.com/jquense/yup) library

##### Example: Components/Forms/ChangePassword.js

```js
// import all field components used
import PasswordField from "../Fields/PasswordField";

// define fields object with form field labels, components, validation
const fields = {
  oldPassword: {
    label: "Old Password",
    component: PasswordField,
    validation: Yup.string("What was you old password").required(
      "What was your old password"
    )
  },
  newPassword: {
    label: "New Password",
    component: PasswordField,
    validation: Yup.string("Choose a new password").required(
      "Password is required"
    )
  },
  confirmNewPassword: {
    label: "Confirm New Password",
    component: PasswordField,
    validation: Yup.string("Choose a new password that matches the other one")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Password confirm is required")
  }
};

// pass fields, initialValues, and onSubmit into commom Form component
const ChangePasswordForm = ({ initialValues, onSubmit, children }) => (
  <Form fields={fields} initialValues={initialValues} onSubmit={onSubmit}>
    {children}
  </Form>
);
```

#### Common Form component

This common Form component implements Formik and creates a `form` based on the `fields` it recieves. The `form` object and selected Formik props are passed down to children as render props.

##### Components/Forms/Form.js

```js
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
```

#### Form Page

A Form Page consists of two pieces, a connected master component `index.js` file and a specifically named layout component.

##### Example: Pages/ChangePassword/index.js

This connected master component is not implemented yet, but something like this what is in `Components/TopNavigation/index.js`

##### Example: Pages/ChangePassword/ChangePassword.js

This layout component assembles the UI components, implements the specific form component, and  attaches non-field form handler functions to components such as buttons.

```js
<ChangePasswordForm
  onSubmit={x => console.log("Make this real!")}
  initialValues={{
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  }}
>
  {({
    /* Formik render props, see Form.js */
    form,
    isValid,
    handleCancel,
    handleSubmit
  }) => (
    <React.Fragment>
      <p>Change Password</p>
      {form}
      <Button
        buttonType="cancel"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        buttonType="submit"
        disabled={!isValid}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </React.Fragment>
  )}
</ChangePasswordForm>
```

### Testing

To run tests against the backend, you need to run the test stack:

```bash
    docker-compose stop api
    docker-compose -f docker-compose-test.yml run api
    cd app && npm test

```

You can then run the test suite locally, and add/remove tests against api by removing the test/recordings.
