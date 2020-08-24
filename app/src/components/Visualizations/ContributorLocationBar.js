/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
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

ContributorLocationBar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      count: PropTypes.number,
      total: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  count: PropTypes.bool,
};

export default ContributorLocationBar;
