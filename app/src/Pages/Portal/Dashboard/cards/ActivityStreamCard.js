import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { getCurrentGovernmentId } from '../../../../state/ducks/governments';
import { getActivities } from '../../../../state/ducks/activities';
import { ActivityList } from '../../../../components/Forms/ActivityStream/ActivitySection';

const styles = css`
  ul {
    list-style: none;
    padding: 0;
    font-size: 20px;
  }
`;

class ActivityStreamCard extends React.Component {
  render() {
    const { governmentActivities, governmentId } = this.props;
    return (
      <div css={styles}>
        <h3>Recent Activity</h3>
        <ActivityList
          activitiesArray={governmentActivities}
          governmentId={governmentId}
        />
      </div>
    );
  }
}

export default connect(state => ({
  isLoading: state.summary.isLoading,
  governmentId: getCurrentGovernmentId(state),
  governmentActivities: getActivities(state),
}))(ActivityStreamCard);
