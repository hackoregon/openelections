import React from 'react';
import Sidebar from './Sidebar';

describe('<Sidebar/>', () => {
  it('should be defined', () => {
    expect(Sidebar).toMatchSnapshot();
  });
});
