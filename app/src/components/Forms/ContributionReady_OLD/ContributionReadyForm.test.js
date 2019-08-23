import React from 'react';
import ContributionReadyForm from './ContributionReadyForm';

describe('<ContributionReadyForm/>', () => {
  it('should be defined', () => {
    expect(ContributionReadyForm).toMatchSnapshot();
  });
});
