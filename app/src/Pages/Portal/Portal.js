import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Modal from "../../components/Modal/index";
import DashboardPage from "./Dashboard/Dashboard";
import ManagePortalPage from "./ManagePortal/index";
import ManageUserPage from "./ManagePortal/ManageUser/ManageUser";
import ContributionsPage from "./Contributions/Contributions";
import PageHoc from "../../components/PageHoc/PageHoc";
import Sidebar from "../../components/Sidebar";
import { connect } from "react-redux";
import { isLoggedIn, logout } from "../../state/ducks/auth";
import { flashMessage } from "redux-flash";
import ResetPassword from "../ResetPassword/ResetPassword";

/* @jsx jsx */
import { css, jsx } from "@emotion/core";

const styles = css`
  &:after {
    content: "";
    clear: both;
    display: table;
  }
  .sidebar-wrapper {
    width: 20%;
    position: sticky;
    top: 0;
    left: 0;
  }

  .content-wrapper {
    width: 80%;
    padding-left: 20px;
    padding-right: 20px;
    border-left: 1px solid rgba(0, 0, 0, 0.15);
  }

  .content-wrapper,
  .sidebar-wrapper {
    float: left;
    padding-top: 20px;
  }
`;

const Portal = props => {
  let search = new URLSearchParams(props.location.search);

  if(!props.isLoggedIn){
    //TODO Check if they are a gov admin
    props.dispatch(flashMessage("Please sign in", {props:{variant:'warning'}}));
    props.history.push('/sign-in');
  } 
  return (
    <PageHoc>
      <div css={styles} className={"portal-wrapper"}>
        <aside className={"sidebar-wrapper"}>
          <Sidebar
            links={[
              { url: "/dashboard", label: "Dashboard" },
              { url: "/contributions", label: "Contributions" },
              { url: "/expenses", label: "Expenses" },
              { url: "/visualize", label: "Visualize" },
              { url: "/manage-portal", label: "Manage Portal" },
              { url: "/reset-password", label: "Reset Password" }
            ]}
          />
        </aside>
        <main className={"content-wrapper"}>
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
                      <Route
                        exact
                        path="/contributions"
                        component={ContributionsPage}
                      />                                     
                      <Route
                        exact
                        path="/reset-password"
                        component={ResetPassword}
                      />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              </>
            )}
          />
        </main>
      </div>
      {/* add modal here 
        TODO: pass open handler and closing through connector
      */}
      <Modal />
    </PageHoc>
  );
};
export default connect(
  state => ({
  isLoggedIn: isLoggedIn(state)
}
))(Portal);
