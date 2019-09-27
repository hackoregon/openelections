import * as React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
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
  componentDidMount() {
    this.setState({
      activitiesList: this.props.getActivities,
    });
  }

  render() {
    const { match, getActivities } = this.props;
    return (
      <div css={styles}>
        <h3>Recent Activity</h3>
        <ActivityList activitiesArray={getActivities} />
      </div>
    );
  }
}

export default connect(state => ({
  isLoading: state.summary.isLoading,
  getActivities: getActivities(state),
}))(ActivityStreamCard);
