import React from 'react';
import Form from './Form';

describe('<Form />', () => {
  it('should be defined', () => {
    expect(Form).toMatchSnapshot();
  });
});
