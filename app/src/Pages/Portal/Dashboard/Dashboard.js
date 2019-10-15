import * as React from 'react';
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
import PageHoc from '../../../components/PageHoc/PageHoc';
import SummaryCard from './cards/SummaryCard';
import LinksCard from './cards/LinksCard';
import SearchCard from './cards/SearchCard';
import ActivityStreamCard from './cards/ActivityStreamCard';
import { isGovAdmin } from '../../../state/ducks/auth';

/** @jsx jsx */
import { mediaQueryRanges, accents } from '../../../assets/styles/variables';

const styles = css`
  .cards-wrapper {
    margin-top: calc(2vw + 10px);

    .card:first-of-type {
      padding: 20px;
    }

    .card:nth-child(2) {
      padding: 20px;
    }

    .card {
      border: 2px solid ${accents.lightGrey};
      padding: 20px;
    }
  }

  @media ${mediaQueryRanges.mediumAndUp} {
    .cards-wrapper {
      display: flex;
      flex-wrap: wrap;

      .left-cards:first-of-type {
        flex: 3;
        margin-right: 10px;
      }

      .right-cards:nth-child(2) {
        flex: 2;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .card.small {
        height: 48%;
      }
      .card.bottom {
        flex: 5;
      }
    }
  }
`;

const TemporaryOverlayStyles = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(240, 240, 240, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  &:before {
    content: 'Coming Soon ...';
    font-size: 20px;
    color: #888;
    margin-bottom: 20px;
  }
`;

const DashboardPage = props => {
  return (
    <PageHoc>
      <div css={styles}>
        <h1>Dashboard</h1>
        <div className="cards-wrapper">
          <div className="left-cards">
            <div className="card large">
              <SummaryCard />
            </div>
          </div>
          <div className="right-cards">
            <div className="card small" style={{ position: 'relative' }}>
              <SearchCard />
              <div css={TemporaryOverlayStyles} />
            </div>
            <div className="card small">
              {/* Jaron links go here */}
              <LinksCard
                links={
                  props.isGovAdmin
                    ? [
                        { path: '/settings', label: 'Invite User' },
                        { path: '/reset-password', label: 'Reset Password' },
                      ]
                    : [
                        { path: '/contributions', label: 'Add Contribution' },
                        { path: '/expenses', label: 'Add Expense' },
                        { path: '/settings', label: 'Invite User' },
                        { path: '/reset-password', label: 'Reset Password' },
                      ]
                }
              />
            </div>
          </div>
        </div>
        <div className="cards-wrapper">
          <div className="card bottom">
            {props.authLoading ? null : <ActivityStreamCard />}
          </div>
        </div>
      </div>
    </PageHoc>
  );
};

export default connect(state => ({
  authLoading: state.auth.isLoading,
  isGovAdmin: isGovAdmin(state),
}))(DashboardPage);
