import React from 'react'; // eslint-disable-line
import AddressLookupField from './AddressLookupField';

describe('<AddressLookupField/>', () => {
  it('should be defined', () => {
    expect(AddressLookupField).toMatchSnapshot();
  });
});
