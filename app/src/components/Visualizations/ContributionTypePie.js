import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { PieChart } from '@hackoregon/component-library';

const { dollars, titleCase } = civicFormat;

function ContributionTypePie({ data }) {
  return (
    <div className="card">
      <h3>Who is Contributing?</h3>
      <h4>By Contribution Total</h4>
      <PieChart data={data} dataKey="type" dataValue="total" dataLabel="type" />
      <h4>By Number of Contributors</h4>
      <PieChart data={data} dataKey="type" dataValue="count" dataLabel="type" />
    </div>
  );
}

export default ContributionTypePie;
