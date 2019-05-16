import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import DashboardPage from "./Dashboard/Dashboard";
import ContributionsPage from "./Contributions/Contributions";
import PageHoc from "../../components/PageHoc/PageHoc";

const Portal = props => {
  return (
    <PageHoc>
      <main>
        <div>side nav</div>
        <Route
          render={({ location }) => (
            <>
              <TransitionGroup className="oe-portal-container">
                <CSSTransition
                  key={location.pathname}
                  timeout={{ enter: 500, exit: 300 }}
                  classNames="page"
                  appear
                >
                  <Switch location={location}>
                    <Route exact path="/dashboard" component={DashboardPage} />
                    <Route
                      exact
                      path="/contributions"
                      component={ContributionsPage}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            </>
          )}
        />
      </main>
    </PageHoc>
  );
};
export default Portal;
