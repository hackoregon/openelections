import React from 'react'; // eslint-disable-line no-unused-vars
import DateRangeField from './DateRangeField';

describe('<DateTimeRangeField/>', () => {
  it('should be defined', () => {
    expect(DateRangeField).toMatchSnapshot();
  });
});
