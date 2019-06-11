import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import DashboardPage from "./Dashboard/Dashboard";
import ContributionsPage from "./Contributions/Contributions";
import PageHoc from "../../components/PageHoc/PageHoc";
import Sidebar from "../../components/Sidebar/Sidebar";

/* @jsx jsx */
import { css, jsx } from '@emotion/core';

const styles = css`

`;

const Portal = props => {
  return (
    <PageHoc css={styles}>
      <main>
          <Sidebar links={[
              { url: '/manage', label: 'Manage' },
              { url: '/contributions', label: 'Contributions' }
          ]} />
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
