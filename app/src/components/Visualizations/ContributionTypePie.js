import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { PieChart } from '@hackoregon/component-library';
import OpenElectionsVictoryTheme from './OpenElectionsVictoryTheme';

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
          theme={OpenElectionsVictoryTheme}
        />
      )}
      {count && (
        <PieChart
          data={data}
          dataLabel="formattedType"
          dataValue="count"
          useLegend
          subtitle="Number of contributions by size"
          theme={OpenElectionsVictoryTheme}
        />
      )}
    </div>
  );
}

export default ContributionTypePie;
