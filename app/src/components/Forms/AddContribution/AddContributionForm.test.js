import React from 'react';
import AddContributionForm from './AddContributionForm';

describe('<AddContributionForm/>', () => {
  it('should be defined', () => {
    expect(AddContributionForm).toMatchSnapshot();
  });
});
