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
<<<<<<< HEAD
  flex-direction: row;
  align-items: flex-end;
  > div {
    margin: 0 5px;  
  }
=======
  flex-direction: column;
>>>>>>> hook up api redux duck and do basic style tweek
`;

const FilterContribution = props => (
  <>
    {console.log({ props })}
    <FilterContributions
      onSubmit={(filterOptions) => {
        const data = {
          governmentId: props.govId,
          currentUserId: props.userId,
          campaignId: props.campaignId,
        };

        if (filterOptions.status && filterOptions.status !== "All Statuses") {
          data.status = STATUS_OPTIONS[filterOptions.status]
        }

        if (filterOptions.range) {
          if (filterOptions.range.from) {
            data.from = filterOptions.range.from;
          }

          if (filterOptions.range.to) {
            data.to = filterOptions.range.to;
          }

        }
        props.getContributions(data);
      }}
      initialValues={{
        status: "",
        range: {
          to: "",
          from: ""
        }
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
              <div>
                <Button
                  buttonType="submit"
                  disabled={!isValid}
                  onClick={handleSubmit}
                >
                  Filter
                    </Button>
              </div>
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
    userId: isLoggedIn(state) ? state.auth.me.id : null
  }),
  dispatch => {
    return {
      getContributions: (data) => dispatch(getContributions(data))
    };
  }
)(FilterContribution);
