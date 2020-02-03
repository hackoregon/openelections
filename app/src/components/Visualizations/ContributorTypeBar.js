import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { HorizontalBarChart } from '@hackoregon/component-library';

const { numeric, dollars } = civicFormat;

function ContributionTypeBar({ data, count }) {
  const filteredData = data.filter(el => el.count > 0 && el.total > 0);

  return (
    <div className="card">
      {!count && (
        <HorizontalBarChart
          data={filteredData}
          dataKey="type"
          dataValue="total"
          dataLabel="label"
          xLabel="Amount"
          yLabel="Type"
          xNumberFormat={dollars}
          dataValueFormatter={x => dollars(x)}
          title="By Contributor Type"
          subtitle="Total contribution amount by ORESTAR contributor type"
        />
      )}
      {count && (
        <HorizontalBarChart
          data={filteredData}
          dataKey="type"
          dataValue="count"
          dataLabel="label"
          xLabel="Contributions"
          yLabel="Type"
          dataValueFormatter={x => numeric(x)}
          title="By Contributor Type"
          subtitle="Number of contributions by ORESTAR contributor type"
        />
      )}
    </div>
  );
}

export default ContributionTypeBar;
