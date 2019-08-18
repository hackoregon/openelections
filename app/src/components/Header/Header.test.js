import React from 'react';
import Header from './Header';

describe('<Header/>', () => {
  it('should be defined', () => {
    expect(Header).toMatchSnapshot();
  });
});
