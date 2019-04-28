# Open Elections Frontend
This project was bootstrapped with Create React App. 


## Table of Contents

- [Quick start](#quick-start)
- [Adding Routes](#adding-routes)


## Quick Start
The following commands are available in this project:
> you can use npm too

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
import HomePage from './Home/Home'
```
Then add it to the Switch BEFORE the Route Component rendering the Portal Component:
```js
// routes.js
<Switch location={location}>
  <Route
    exact
    path="/"
    component={HomePage}/>
  <Route
    component={Portal}/>
</Switch>
```

### Adding Portal Pages
To add pages to the portal, first import the page component in the `./src/Pages/Portal/Portal.js` file:

```js
import DashboardPage from './Dashboard/Dashboard'
```

Then add it to the Switch:
```js
<Switch location={location}>
  <Route
    exact
    path="/dashboard"
    component={DashboardPage}/>
  <Route
    exact
    path="/contributions"
    component={ContributionsPage}/>
</Switch>
```