import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { PieChart } from '@hackoregon/component-library';

const { dollars, titleCase } = civicFormat;

function ContributionTypePie({ data, count }) {
  return (
    <div className="card">
      {!count && (
        <PieChart
          data={data}
          dataLabel="formattedType"
          dataValue="total"
          useLegend
          subtitle="Total contribution amount by size"
        />
      )}
      {count && (
        <PieChart
          data={data}
          dataLabel="formattedType"
          dataValue="count"
          useLegend
          subtitle="Number of contributions by size"
        />
      )}
    </div>
  );
}

export default ContributionTypePie;
