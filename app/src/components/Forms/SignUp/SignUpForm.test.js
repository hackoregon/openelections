import React from 'react';
import SignUpForm from './SignUpForm';

describe('<SignUpForm/>', () => {
  it('should be defined', () => {
    expect(SignUpForm).toMatchSnapshot();
  });
});
