/** @jsx jsx */
import { Route, Switch } from 'react-router-dom';
import { css, jsx } from '@emotion/core';
import Modal from '../../components/Modal/index';
import DashboardPage from './Dashboard/Dashboard';
import ManagePortalPage from './ManagePortal/index';
import ManageUserPage from './ManagePortal/ManageUser/index';
import ExpensesPage from './Expenses/index';
import PageHoc from '../../components/PageHoc/PageHoc';
import Sidebar from '../../components/Sidebar';
import WithPermissions from '../../components/WithPermissions';
import ManageCampaignPage from './ManageCampaign';
import ContributionsPage from './Contributions/index';

/* @jsx jsx */
import { mediaQueryRanges } from '../../assets/styles/variables';

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

const Portal = () => (
  <PageHoc>
    <div css={styles} className="portal-wrapper">
      <aside className="sidebar-wrapper">
        <Sidebar />
      </aside>
      <main className="content-wrapper">
        <WithPermissions>
          <Route
            render={({ location }) => (
              <div key={location.pathname}>
                <Switch location={location}>
                  <Route exact path="/dashboard" component={DashboardPage} />
                  <Route exact path="/settings" component={ManagePortalPage} />
                  <Route
                    exact
                    path="/settings/manage-user"
                    component={ManageUserPage}
                  />
                  <Route exact path="/dashboard" component={DashboardPage} />
                  <Route path="/contributions" component={ContributionsPage} />
                  <Route path="/expenses" component={ExpensesPage} />
                  <Route
                    exact
                    path="/campaigns"
                    component={ManageCampaignPage}
                  />
                </Switch>
              </div>
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
export default Portal;
