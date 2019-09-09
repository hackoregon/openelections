import * as React from "react";
import PageHoc from "../../../components/PageHoc/PageHoc";
import ContributionsData from "./mock-contributions.json";
import { civicFormat } from "@hackoregon/component-library/dist/utils";
import {
  HorizontalBarChart,
  BaseMap,
  ScreenGridMap
} from "@hackoregon/component-library";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { mediaQueryRanges, accents } from "../../../assets/styles/variables";

const { numeric, dollars } = civicFormat;

const styles = css`
  .cards-wrapper {
    margin-top: calc(2vw);

    .card {
      border: 2px solid ${accents.lightGrey};
      padding: 15px;
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

  .big-number {
    font-weight: bold;
    font-size: 32px;
  }

  @media ${mediaQueryRanges.mediumAndUp} {
    .cards-wrapper {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      width: 100%;

      .cards-ribbon {
        height: 35vh;
        width: 100%;
        display: flex;
        flex-direction: row;

        .card {
          width: 50%;
        }
      }

      .card.featured {
        height: 50vh;
        width: 100%;
      }
    }
  }
`;

const titleCase = str =>
  str
    .split(/[_-]/)
    .map(word => word[0].toUpperCase() + word.substr(1))
    .join(" ");

const summarizeBy = (data, key) =>
  data.reduce((hash, d) => {
    if (hash[d[key]]) {
      hash[d[key]] += d.amount;
    } else {
      hash[d[key]] = d.amount;
    }
    return hash;
  }, {});

const arrFromHash = (hash, key = "key", value = "value") =>
  Object.keys(hash).map(entry => ({
    [key]: titleCase(entry),
    [value]: hash[entry]
  }));

const uniqueDonorsCount = data => {
  var s = new Set();
  data.forEach(d => s.add(d.matchId || d.contributorName));
  return s.size;
};

const donationsByContributorType = data =>
  arrFromHash(summarizeBy(data, "contributionSubType"), "type", "amount");

const donationsByContributionType = data =>
  arrFromHash(summarizeBy(data, "contributorType"), "type", "amount");

const propertiesFrom = data => data.features.map(f => f.properties);

const OceanColorScheme = [
  [237, 248, 177],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [37, 52, 148],
  [8, 29, 88]
];

const VisualizePage = props => {
  const table = propertiesFrom(ContributionsData);
  const uniqueDonors = uniqueDonorsCount(table);
  const byContributorType = donationsByContributorType(table);
  const byContributionType = donationsByContributionType(table);
  return (
    <PageHoc>
      <div css={styles}>
        <h1>Visualize</h1>
        <div className="cards-wrapper">
          <div className="cards-ribbon">
            <div className="card">
              <h3>Who is Donating?</h3>
              <HorizontalBarChart
                data={byContributorType}
                dataValue="amount"
                dataLabel="type"
                xLabel="Dollars"
                dataValueFormatter={dollars}
                minimalist
              />
            </div>
            <div className="card">
              <h3>How are they Donating?</h3>
              <HorizontalBarChart
                data={byContributionType}
                dataValue="amount"
                dataLabel="type"
                xLabel="Dollars"
                dataValueFormatter={dollars}
                minimalist
              />
            </div>
          </div>
          <div className="card featured">
            <BaseMap updateViewport={false} initialZoom={11} useContainerHeight>
              <ScreenGridMap
                data={ContributionsData.features}
                getPosition={f => f.geometry.coordinates}
                opacity={0.8}
                colorRange={OceanColorScheme}
                cellSizePixels={50}
              />
            </BaseMap>
          </div>
        </div>
      </div>
    </PageHoc>
  );
};
export default VisualizePage;
