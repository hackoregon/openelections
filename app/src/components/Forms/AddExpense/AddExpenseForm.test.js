import React from 'react';
import AddExpenseForm from './AddExpenseForm';

describe('<AddExpenseForm/>', () => {
  it('should be defined', () => {
    expect(AddExpenseForm).toMatchSnapshot();
  });
});
