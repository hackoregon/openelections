import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { mediaQueryRanges, accents } from "../../../assets/styles/variables";

const styles = css`
  .cards-wrapper {
    margin-top: calc(2vw);

    .card {
      border: 2px solid ${accents.lightGrey};
      padding: 15px;
      /* background: rgba(0,0,0,0.25); */
      margin-bottom: 15px;

      + .card {
        margin-left: 15px;
      }

      h3 {
        font-size: 16px;
        font-weight: normal;
      }
    }
  }

  @media ${mediaQueryRanges.mediumAndUp} {
    .cards-wrapper {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      width: 100%;

      .card {
        display: flex;
      }

      .cards-ribbon {
        height: 25vh;
        width: 100%;
        display: flex;
        flex-direction: row;

        .card {
          width: 33.33%;
        }
      }

      .card.featured {
        height: 50vh;
        width: 100%;
      }
    }
  }
`;

const VisualizePage = props => {
  return (
    <PageHoc>
      <div css={styles}>
        <h1>Visualize</h1>
        <div className="cards-wrapper">
          <div className="cards-ribbon">
            <div className="card">
              <h3>Donors for this time period</h3>
            </div>
            <div className="card">
              <h3>Who is Donating?</h3>
            </div>
            <div className="card">
              <h3>How are they Donating?</h3>
            </div>
          </div>
          <div className="card featured">
            <h3>Where donations are coming from</h3>
          </div>
        </div>
      </div>
    </PageHoc>
  );
};
export default VisualizePage;
