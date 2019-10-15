import React from 'react'; // eslint-disable-line
import Button from './Button';

describe('<Button/>', () => {
  it('should be defined', () => {
    expect(Button).toMatchSnapshot();
  });
});
