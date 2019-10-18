import React from 'react'; // eslint-disable-line no-unused-vars
import DateTimeRangeField from './DateTimeRangeField';

describe('<DateTimeRangeField/>', () => {
  it('should be defined', () => {
    expect(DateTimeRangeField).toMatchSnapshot();
  });
});
