import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { getActivities } from '../../../../state/ducks/activities';
import { ActivityList } from '../../../../components/Forms/ActivityStream/ActivitySection';
import { getCurrentGovernmentId } from '../../../../state/ducks/governments';

const styles = css`
  ul {
    list-style: none;
    padding: 0;
    font-size: 20px;
  }
`;

class ActivityStreamCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentGovernmentId } = this.props;
    console.log({ currentGovernmentId });
    const { getActivities } = this.props;
    return (
      <div css={styles}>
        <h3>Recent Activity</h3>
        <ActivityList
          governmentId={currentGovernmentId}
          activitiesArray={getActivities}
        />
      </div>
    );
  }
}

export default connect(state => ({
  isLoading: state.summary.isLoading,
  currentGovernmentId: getCurrentGovernmentId(state),
  getActivities: getActivities(state),
}))(ActivityStreamCard);
