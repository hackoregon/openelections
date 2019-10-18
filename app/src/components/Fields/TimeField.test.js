import React from 'react'; // eslint-disable-line no-unused-vars
import TimeField from './TimeField';

describe('<TimeField/>', () => {
  it('should be defined', () => {
    expect(TimeField).toMatchSnapshot();
  });
});
