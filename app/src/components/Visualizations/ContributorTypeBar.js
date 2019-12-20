import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { HorizontalBarChart } from '@hackoregon/component-library';

const { numeric, dollars } = civicFormat;

function ContributionTypeBar({ data }) {
  return (
    <div className="card">
      <HorizontalBarChart
        data={data}
        dataKey="type"
        dataValue="total"
        dataLabel="label"
        xLabel="Amount"
        yLabel="Category"
        xNumberFormat={dollars}
        dataValueFormatter={x => dollars(x)}
        title="Total Contributions"
        subtitle="Total contribution amount by ORESTAR category"
      />
      {/* <HorizontalBarChart
        data={data}
        dataKey="type"
        dataValue="count"
        dataLabel="label"
        xLabel="Contributions"
        yLabel="Category"
        dataValueFormatter={x => numeric(x)}
        title="Number of Contributions"
        subtitle="Number of contributions by ORESTAR category"
      /> */}
    </div>
  );
}

export default ContributionTypeBar;
