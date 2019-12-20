import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { PieChart } from '@hackoregon/component-library';

const { dollars, titleCase } = civicFormat;

function ContributionTypePie({ data }) {
  return (
    <div className="card">
      <h3>Who is Donating?</h3>
      <PieChart data={data} dataKey="type" dataValue="total" dataLabel="type" />
    </div>
  );
}

export default ContributionTypePie;
