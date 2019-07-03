import React from "react";
import { Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TopNavigation from "../components/TopNavigation";
import HomePage from "./Home/Home";
import AboutPage from "./About/About";
import SandboxPage from "./Sandbox/Sandbox";
import SignInPage from "./SignIn/SignIn";
import SignUpPage from "./SignUp/SignUp";
import InvitationConfirmationPage from "./InvitationConfirmation/InvitationConfirmation";
import ForgotPasswordPage from "./ForgotPassword/ForgotPassword";
import UpdateForgottenPasswordPage from "./UpdateForgottenPassword/UpdateForgottenPassword";
import Portal from "./Portal/Portal";

const shouldTransition = location => {
  let transitionPages = ["/", "/about", "/sandbox"];
  if (transitionPages.includes(location.pathname)) {
    return true;
  } else {
    return false;
  }
};

const Routes = props => {
  return (
    <Route
      render={({ location }) => (
        <>
          <TopNavigation />
          <TransitionGroup className="oe-page-container">
            <CSSTransition
              key={shouldTransition(location) ? location.pathname : "nope"}
              timeout={{ enter: 500, exit: 300 }}
              classNames="page"
              appear
            >
              <Switch location={location}>
                <Route exact path="/" component={HomePage} />

                <Route exact path="/about" component={AboutPage} />
                <Route exact path="/sandbox" component={SandboxPage} />
                <Route exact path="/sign-in" component={SignInPage} />
                <Route exact path="/sign-up" component={SignUpPage} />
                <Route exact path="/invitation-confirmation" component={InvitationConfirmationPage} />
                <Route
                  exact
                  path="/forgot-password"
                  component={ForgotPasswordPage}
                />
                <Route
                  exact
                  path="/update-forgotten-password"
                  component={UpdateForgottenPasswordPage}
                />
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
