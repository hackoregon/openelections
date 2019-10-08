import React from 'react';
import ActivityStreamForm from './index';

describe('<ActivityStreamForm/>', () => {
  it('should be defined', () => {
    expect(ActivityStreamForm).toMatchSnapshot();
  });
});
