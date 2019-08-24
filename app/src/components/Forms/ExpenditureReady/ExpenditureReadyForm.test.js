import React from 'react';
import ExpenditureReadyForm from './ExpenditureReadyForm';

describe('<ExpenditureReadyForm/>', () => {
  it('should be defined', () => {
    expect(ExpenditureReadyForm).toMatchSnapshot();
  });
});
