import React from 'react';
import UserInfoBox from './index';

describe('<UserInfoBox/>', () => {
  it('should be defined', () => {
    expect(UserInfoBox).toMatchSnapshot();
  });
});
