import React from "react";
import { Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Header from "../components/Header/Header";
import HomePage from "./Home/Home";
import AddUserPage from "./AddUser/AddUser";
import ChangePasswordPage from "./ChangePassword/ChangePassword";
import SignInPage from "./SignIn/SignIn";
import SignUpPage from "./SignUp/SignUp";
import Portal from "./Portal/Portal";


const Routes = props => {
  return (
    <Route
      render={({ location }) => (
        <>
          <Header />
          <TransitionGroup className="oe-page-container">
            <CSSTransition
              key={location.pathname}
              timeout={{ enter: 500, exit: 300 }}
              classNames="page"
              appear
            >
              <Switch location={location}>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/add-user" component={AddUserPage} />
                <Route
                  exact
                  path="/change-password"
                  component={ChangePasswordPage}
                />
                <Route exact path="/sign-in" component={SignInPage} />
                <Route exact path="/sign-up" component={SignUpPage} />
                <Route component={Portal} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </>
      )}
    />
  );
};
export default Routes;
