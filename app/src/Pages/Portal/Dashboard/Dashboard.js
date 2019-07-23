import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import ContributionsCard from "./ContributionsCard";
import LinksCard from "./LinksCard";

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
        
        .card:first-of-type {
            flex: 3;
            margin-right: 10px;
        }
            
        .card:nth-child(2) {
          flex: 2;
          margin-left: 10px;
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
                <div className="card">
                    <ContributionsCard/>
                </div>
                <div className="card">
                    {/* Jaron links go here */}
                    <LinksCard links={[]} />
                </div>
            </div>
        </div>
    </PageHoc>
  );
};
export default DashboardPage;
