import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { PieChart } from '@hackoregon/component-library';

const { dollars, titleCase } = civicFormat;

function ContributionTypePie({ data }) {
  const arrFromHash = (hash, key = 'key', value = 'value', nestedValue) =>
    Object.keys(hash).map(entry => ({
      [key]: titleCase(entry),
      [value]: nestedValue ? hash[entry][nestedValue] : hash[entry],
    }));

  const donationsByContributorType = data =>
    arrFromHash(data, 'type', 'total', 'total');

  return (
    <div className="card">
      <h3>Who is Donating?</h3>
      <PieChart
        data={donationsByContributorType(data)}
        dataKey="type"
        dataValue="total"
        dataLabel="type"
      />
    </div>
  );
}

export default ContributionTypePie;
