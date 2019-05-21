# Open Elections Frontend

This project was bootstrapped with Create React App.

## Table of Contents

- [Quick start](#quick-start)
- [Adding Routes](#adding-routes)
- [Forms](#forms)

## Quick Start

The following commands are available in this project:
`yarn install` or `yarn --ignore-engines` if you get a node engine incompatability

### `yarn start`

This runs the app in development mode on port 4000.

### `yarn build`

This will build the app into a build directory.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `yarn storybook`

This starts up storybook on port 6006.

### `yarn build-storybook`

This will build your storybook app.

### `yarn run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

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

### File Structure

In the hopes of having single-purpose components, we have a separation of the actual form html element (plus select methods), and the logic/validation/state. The forms are utilizing the [`Formik`](https://jaredpalmer.com/formik/) library, [`Yup`](https://github.com/jquense/yup) library, and the [`Material UI`](https://material-ui.com) library. This choice was largely made because creating a form, valiation, & UI system could take a few Hack Oregon seasons and we are volunteers with a deadline 😅. So let's dig a little deeper into how the forms are set up. Ultimately, there are 2 components: the form and the form logic/validation/state.

#### The Form

The forms in the `src/components/Form` directory should return the `<form>...</form>` jsx. Since this component is wrapped in the Formik HOC, it has access to a [bunch of useful props](https://jaredpalmer.com/formik/docs/api/formik#props). When creating this component be sure to checkout the [material ui docs](https://material-ui.com).

#### Form Logic / Validation / State

In this component the [validationSchema]() should be defined, a state will need to be utilize (so it should be a stateful component), styles should be defined (if not global already), and any special logic should be defined, such as a method that handles updating the state from a `select` component. This form does not have to be located anywhere in particular.

### Validation

Here is an example of the Sign up form `validationSchema`. It is utilizing the [`Yup`](https://github.com/jquense/yup) library.

```js
const validationSchema = Yup.object({
  userRole: Yup.string("Choose a user role").required(
    "A user role is required"
  ),
  firstName: Yup.string("Enter your first name").required(
    "First Name is required"
  ),
  lastName: Yup.string("Enter your last name").required(
    "Last Name is required"
  ),
  email: Yup.string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required")
});
```

### Testing

To run tests against the backend, you need to run the test stack:

```bash
    docker-compose -f docker-compose-test.yml run api

```

You can then run the test suite locally, and add/remove tests against api by removing the test/recordings.
