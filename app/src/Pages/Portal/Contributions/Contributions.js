import * as React from "react";
import { Route, Switch } from "react-router-dom";
import PageHoc from "../../../components/PageHoc/PageHoc";
import AddContribution from "./AddContribution/AddContribution";
import ContributionReady from "../../../components/Forms/ContributionReady";
import ContributionSubmitted from "./ContributionSubmitted/ContributionSubmitted";
import ContributionNeedsReview from "../../../components/Forms/CityViews/ContributionNeedsReview";

const ContributionsPage = props => {
  return (
    <PageHoc>
      <Route 
        render={({ location }) => (
          <Switch location={location}>
            {/* CAMPAIGN PAGES */}
            <Route 
              path="/"
              component={() => <h1>Contributions</h1>}
            />
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
            {/* TODO: CITY PAGES */}
          </Switch>
        )}
      />
      
    </PageHoc>
  );
};
export default ContributionsPage;
