import * as React from 'react';
import { connect } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Link } from 'react-router-dom';
import { mediaQueryRanges } from '../../../../assets/styles/variables';
import LoadingCircle from '../../../../assets/icons/loading-circle';

const styles = css`
  min-height: 300px;
  position: relative;

  .top-section {
    margin-bottom: 20px;
  }

  .column .top-section a {
    display: block;
    margin-bottom: 2px;
  }

  .money.big {
    font-size: 3.2em;
  }

  .money.small {
    font-size: 1.5em;
  }

  h4 {
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 0;
    line-height: 1.1;
  }

  p {
    margin-top: 0;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  .loading-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media ${mediaQueryRanges.mediumAndUp} {
    .columns {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .column {
      width: 45%;
    }
  }
`;

class SummaryCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: {},
    };
  }

  getData() {
    const { contributions = [], expenditures = [] } = this.props;

    const contributionsOfStatus = status =>
      contributions.find(item => item.status === status) || {
        amount: 0,
        matchAmount: 0,
        total: 0,
      };

    const expendituresOfStatus = status =>
      expenditures.find(item => item.status === status) || {
        amount: 0,
        total: 0,
      };

    const getTotals = contributionsOrExpenses => {
      const result = {};
      let total = 0;
      contributionsOrExpenses.forEach(item => {
        total += item.total;
        // This is to capitalize the key 🙃
        result[item.status[0].toUpperCase() + item.status.slice(1)] =
          item.total;
      });
      result.total = total;
      return result;
    };

    return {
      totalContributions: getTotals(contributions),
      totalExpenditures: getTotals(expenditures),
      moneyRaised: contributionsOfStatus('Processed').amount,
      moneyMatched: contributionsOfStatus('Processed').matchAmount,
      moneyPending:
        contributionsOfStatus('Draft').amount +
        contributionsOfStatus('Submitted').amount,
      moneySpentPending:
        expendituresOfStatus('draft').amount +
        expendituresOfStatus('submitted').amount,
      moneySpentInCompliance: expendituresOfStatus('in_compliance').amount,
      moneySpentOutOfCompliance: expendituresOfStatus('out_of_compliance')
        .amount,
    };
  }

  money(number) {
    return `$${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  renderStats() {
    const { isLoading } = this.props;
    const data = !isLoading ? this.getData() : {};

    return (
      <div className="columns">
        <div className="column">
          <h5>Contributions</h5>
          <p className="top-section">
            <Link to="/contributions">
              Total: {data.totalContributions.total}
            </Link>
            {delete data.totalContributions.total}
            {Object.keys(data.totalContributions).map(key => (
              <Link to={`/contributions?status=${key.toLowerCase()}`}>
                {key}: {data.totalContributions[key]}
              </Link>
            ))}
          </p>
          <div className="panel">
            <h4>Total Raised (Processed)</h4>
            <p className="money small">{this.money(data.moneyRaised)}</p>
          </div>
          <div className="panel">
            <h4>Total Matched (Processed)</h4>
            <p className="money small">{this.money(data.moneyMatched)}</p>
          </div>
          <div className="panel">
            <h4>Total Pending:</h4>
            <p className="money small">{this.money(data.moneyPending)}</p>
          </div>
        </div>
        <div className="column">
          <h5>Expenses</h5>
          <p className="top-section">
            <Link to="/contributions">
              Total: {data.totalExpenditures.total}
            </Link>
            {delete data.totalExpenditures.total}
            {Object.keys(data.totalExpenditures).map(key => (
              <Link to={`/expenses?status=${key.toLowerCase()}`}>
                {key}: {data.totalExpenditures[key]}
              </Link>
            ))}
          </p>
          <div className="panel">
            <h4>Total Spent (Pending)</h4>
            <p className="money small">{this.money(data.moneySpentPending)}</p>
          </div>
          <div className="panel">
            <h4>Total Spent (In Compliance)</h4>
            <p className="money small">
              {this.money(data.moneySpentInCompliance)}
            </p>
          </div>
          <div className="panel">
            <h4>Total Spent (Out of Compliance)</h4>
            <p className="money small">
              {this.money(data.moneySpentOutOfCompliance)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { isLoading } = this.props;
    const data = !isLoading ? this.getData() : {};

    return (
      <div css={styles}>
        <div className="top-section">
          <h3>Campaign Finances</h3>
          <div className="filter" />
        </div>

        {isLoading ? (
          <LoadingCircle className="loading-circle" radius={50} />
        ) : (
          this.renderStats()
        )}
      </div>
    );
  }
}
export default connect(state => ({
  isLoading: state.summary.isLoading,
  contributions: state.summary.contributions,
  expenditures: state.summary.expenditures,
}))(SummaryCard);
