import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import ContributionsCard from "./cards/ContributionsCard";
import LinksCard from "./cards/LinksCard";
import SearchCard from "./cards/SearchCard";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { mediaQueryRanges, accents } from "../../../assets/styles/variables";


const styles = css`   

  .cards-wrapper {
    margin-top: calc(2vw + 10px);
    
    .card:first-of-type {
      padding: 20px;
    }
    
    .card:nth-child(2) {
      padding: 20px;    
    }
    
    .card {
       border: 2px solid ${accents.lightGrey};
       padding: 20px;
    }
  }
  
  @media ${mediaQueryRanges.mediumAndUp} {
    .cards-wrapper {
        display: flex;
        flex-wrap: wrap;
        
        .left-cards:first-of-type {
            flex: 3;
            margin-right: 10px;
        }
            
        .right-cards:nth-child(2) { 
          flex: 2;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .card.small {
          height: 48%;
        }  
        
        
     }  
  }
  
`;

const DashboardPage = props => {
  return (
    <PageHoc>
        <div css={styles}>
            <h1>Dashboard</h1>
            <div className="cards-wrapper">
                <div className="left-cards">
                    <div className="card large">
                        <ContributionsCard/>
                    </div>
                </div>
                <div className="right-cards">
                    <div className="card small">
                        <SearchCard />
                    </div>
                    <div className="card small">
                        {/* Jaron links go here */}
                        <LinksCard links={[
                            {path: "/contributions", label: "Add Contribution"},
                            {path: "/expenses", label: "Add Expense"},
                            {path: "/manage-portal", label: "Invite User"},
                            {path: "/reset-password", label: "Reset Password"}
                        ]} />
                    </div>
                </div>
            </div>
        </div>
    </PageHoc>
  );
};
export default DashboardPage;
