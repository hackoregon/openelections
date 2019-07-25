import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Modal from "../../components/Modal/index";
import DashboardPage from "./Dashboard/Dashboard";
import ManagePortalPage from "./ManagePortal/index";
import ManageUserPage from "./ManagePortal/ManageUser/index";
import ContributionsPage from "./Contributions/Contributions";
import ExpensesPage from "./Expenses/Expenses";
import PageHoc from "../../components/PageHoc/PageHoc";
import Sidebar from "../../components/Sidebar";
import WithPermissions from "../../components/WithPermissions"
import ManageCampaignPage from "./ManageCampaign";

/* @jsx jsx */
import { css, jsx } from "@emotion/core";
import { mediaQueryRanges } from "../../assets/styles/variables";

const styles = css`
  .content-wrapper {
    padding-left: 20px;
    padding-right: 20px;
  }

  .content-wrapper {
    padding-top: 20px;
  }
  
  @media ${mediaQueryRanges.largeAndUp} {
    
    .sidebar-wrapper {
      padding-top: 20px;
    }
  
    &.portal-wrapper {
      display: flex;
    }
    
    .sidebar-wrapper {
      width: 20%;
      
      > div {
        position: sticky;
        top: 10px;
        left: 0;
      }
    }
    
    
    .content-wrapper { 
      width: 80%;
      border-left: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
`;

const Portal = props => {
  return (
    <PageHoc>
      <div css={styles} className={"portal-wrapper"}>
        <aside className={"sidebar-wrapper"}>
          <Sidebar />
        </aside>
        <main className={"content-wrapper"}>
          <WithPermissions>
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
                      <Route
                        exact
                        path="/dashboard"
                        component={DashboardPage}
                      />
                      <Route
                        exact
                        path="/manage-portal"
                        component={ManagePortalPage}
                      />
                      <Route
                        exact
                        path="/manage-portal/manage-user"
                        // children={(match) => {
                        //   console.log({ match });
                        //   return ManageUserPage;
                        // }}
                        component={ManageUserPage}
                      />
                      <Route
                        exact
                        path="/dashboard"
                        component={DashboardPage}
                      />{" "}
                      <Route
                        exact
                        path="/contributions"
                        component={ContributionsPage}
                      />
                      <Route exact path="/expenses" component={ExpensesPage} />
                      <Route
                        exact
                        path="/campaigns"
                        component={ManageCampaignPage}
                      />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              </>
            )}
          />
          </WithPermissions>
        </main>
      </div>
      {/* add modal here
        TODO: pass open handler and closing through connector
      */}
      <Modal />
    </PageHoc>
  );
};
export default Portal;
