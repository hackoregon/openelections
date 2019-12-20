import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { PieChart } from '@hackoregon/component-library';

const { dollars, titleCase } = civicFormat;

function ContributionTypePie({ data }) {
  return (
    <div className="card">
      <PieChart
        data={data}
        dataLabel="formattedType"
        dataValue="total"
        useLegend
        title="Total Contributions"
        subtitle="Total contribution amount by ORESTAR type"
      />
      {/* <PieChart
        data={data}
        dataLabel="formattedType"
        dataValue="count"
        useLegend
        title="Number of Contributions"
        subtitle="Number of contributions by ORESTAR category"
      /> */}
    </div>
  );
}

export default ContributionTypePie;
