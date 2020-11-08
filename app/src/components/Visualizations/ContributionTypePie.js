/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { PieChart } from '@hackoregon/component-library';
// import PieChart from '@hackoregon/component-library/dist/PieChart/PieChart';
import OpenElectionsVictoryTheme from './OpenElectionsVictoryTheme';

function ContributionTypePie({ data, count }) {
  return (
    <div className="card">
      {!count && (
        <PieChart
          data={data}
          dataLabel="formattedType"
          dataValue="total"
          useLegend
          title="By Contribution Size"
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
          title="By Contribution Size"
          subtitle="Number of contributions by size"
          theme={OpenElectionsVictoryTheme}
        />
      )}
    </div>
  );
}

ContributionTypePie.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      formattedType: PropTypes.string,
      count: PropTypes.number,
      total: PropTypes.number,
    })
  ),
  count: PropTypes.bool,
};

export default ContributionTypePie;
