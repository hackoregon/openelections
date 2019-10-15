import React from 'react'; // eslint-disable-line no-unused-vars
import TextField from './TextField';

describe('<TextField/>', () => {
  it('should be defined', () => {
    expect(TextField).toMatchSnapshot();
  });
});
