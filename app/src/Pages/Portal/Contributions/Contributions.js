import * as React from "react";
import { Route, Switch } from "react-router-dom";
import AddContribution from "./AddContribution/AddContribution";
import ContributionReady from "../../../components/Forms/ContributionReady";
import ContributionSubmitted from "./ContributionSubmitted/ContributionSubmitted";
import ContributionsTable from "./ContributionsTable/ContributionsTable";
// import ContributionNeedsReview from "../../../components/Forms/CityViews/ContributionNeedsReview";

const ContributionsPage = props => {
  return (
    <Route 
      render={({ location }) => (
        <Switch location={location}>
          {/* CAMPAIGN PAGES */}
          <Route 
            exact 
            path="/add"
            component={AddContribution}
          />
          <Route 
            exact 
            path="/ready"
            component={ContributionReady}
          />
          <Route 
            exact
            path="/submitted"
            component={ContributionSubmitted}
          />
          <Route component={ContributionsTable} />
          {/* TODO: CITY PAGES */}
        </Switch>
      )}
    />
  );
};
export default ContributionsPage;
