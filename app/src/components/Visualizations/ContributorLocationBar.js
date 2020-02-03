import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { HorizontalBarChart } from '@hackoregon/component-library';

const { numeric, dollars } = civicFormat;

function ContributorLocationBar({ data, count }) {
  return (
    <div className="card">
      {!count && (
        <HorizontalBarChart
          data={data}
          dataKey="type"
          dataValue="total"
          dataLabel="label"
          xLabel="Amount"
          yLabel="Location"
          xNumberFormat={dollars}
          dataValueFormatter={x => dollars(x)}
          title="By Contributor Location"
          subtitle="Total contribution amount by location"
        />
      )}
      {count && (
        <HorizontalBarChart
          data={data}
          dataKey="type"
          dataValue="count"
          dataLabel="label"
          xLabel="Contributions"
          yLabel="Location"
          dataValueFormatter={x => numeric(x)}
          title="By Contributor Location"
          subtitle="Number of contributions by contributor location"
        />
      )}
    </div>
  );
}

export default ContributorLocationBar;
