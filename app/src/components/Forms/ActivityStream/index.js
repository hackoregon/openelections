import React from 'react';
import { ActivitySection } from './ActivitySection';

const ActivityStream = ({ id, contributionId, expenditureId, type }) => {
  return (
    <ActivitySection id={id || contributionId || expenditureId} type={type} />
  );
};
export default ActivityStream;
