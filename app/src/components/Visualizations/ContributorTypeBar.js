/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { civicFormat } from '@hackoregon/component-library/dist/utils';
import { HorizontalBarChart } from '@hackoregon/component-library';

const { numeric, dollars } = civicFormat;

function ContributionTypeBar({ data, count }) {
  if (!data) {
    return null;
  }
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

ContributionTypeBar.propTypes = {
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

export default ContributionTypeBar;
