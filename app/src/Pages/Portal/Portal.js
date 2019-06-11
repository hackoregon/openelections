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
  .sidebar-wrapper {
    width: 20%;
  }
  
  .content-wrapper {
    width: 80%;
    padding-left: 20px;  
    border-left: 1px solid rgba(0, 0, 0, 0.15);
  }
  
  .content-wrapper, .sidebar-wrapper {
    float: left;
    padding-top: 20px;  
  }
`;

const Portal = props => {
  return (
    <PageHoc>
      <div css={styles} className={'portal-wrapper'}>
          <aside className={'sidebar-wrapper'}>
              <Sidebar links={[
                  { url: '/manage', label: 'Manage' },
                  { url: '/contributions', label: 'Contributions' }
              ]} />
          </aside>
          <main className={'content-wrapper'}>
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
      </div>
    </PageHoc>
  );
};
export default Portal;
