import React from "react";
import { connect } from "react-redux";
import Button from "../../Button/Button";
import FilterContributions from "./FilterContributions";
import { getContributions } from "../../../state/ducks/contributions";


/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { isLoggedIn } from "../../../state/ducks/auth";


const STATUS_OPTIONS = {
  "All Statuses": "all",
  "Archived": "Archived",
  "Draft": "Draft",
  "Submitted": "Submitted",
  "Processed": "Processed"
}

const wtf = css`
  display: flex;
  flex-direction: row;
`;

const FilterContribution = props => (
  <>
    {console.log({ props })}
    <FilterContributions
      onSubmit={(filterOptions) => {
        const data = {
          governmentId: props.govId,
          currentUserId: props.userId,
          campaignId: props.campaignId
        };
        filterOptions.status !== "all" ? data.status = STATUS_OPTIONS[filterOptions.status] : data.status = null
        console.log(filterOptions, data)
        props.getContributions(data);
      }}
      initialValues={{
        status: "All Statuses"
      }}
    >
      {({
        formSections,
        isValid,
        handleSubmit /* isDirty, isSubmitting */
      }) => (
          <React.Fragment>
            <div className="nark" css={wtf}>
              {formSections.filter}
            </div>
            <div>
              <Button
                buttonType="submit"
                disabled={!isValid}
                onClick={handleSubmit}
              >
                Filter
            </Button>
            </div>
          </React.Fragment>
        )}
    </FilterContributions>
  </>
);

// export default FilterContribution;
export default connect(
  state => ({
    orgId: state.campaigns.currentCampaignId || state.governments.currentGovernmentId,
    campaignId: state.campaigns.currentCampaignId,
    govId: state.governments.currentGovernmentId || 1,
    userId: isLoggedIn(state) ? state.auth.me.id: null
  }),
  dispatch => {
    return {
      getContributions: (data) => dispatch(getContributions(data))
    };
  }
)(FilterContribution);
