import * as React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { NavLink } from 'react-router-dom';

const styles = css`
  ul {
    list-style: none;
    padding: 0;
    font-size: 20px;
  }
`;

const ActivityStreamCard = props => {
  return (
    <div css={styles}>
      <h3>Recent Activity</h3>
      <ul>
        <p>words here just to see</p>
      </ul>
    </div>
  );
};
export default ActivityStreamCard;
