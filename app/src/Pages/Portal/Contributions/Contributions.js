import * as React from "react";
import { Route, Switch } from "react-router-dom";
import AddContribution from "./AddContribution/AddContribution";
import ContributionReady from "../../../components/Forms/ContributionReady";
import ContributionSubmitted from "./ContributionSubmitted/ContributionSubmitted";
import ContributionsTable from "./ContributionsTable/ContributionsTable";
// import ContributionNeedsReview from "../../../components/Forms/CityViews/ContributionNeedsReview";

const Contributions = props => {
  console.log(props)
  const { match } = props
  return (
    <Route 
      render={({ location }) => {
        return (
        <Switch location={location}>
          {/* CAMPAIGN PAGES */}
          <Route 
            exact 
            path={`${match.url}/`}
            component={ContributionsTable} 
          />
          <Route 
            exact 
            path={`${match.url}/add`}
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
          {/* TODO: CITY PAGES */}
        </Switch>
      )}}
    />
  );
};
export default Contributions;
