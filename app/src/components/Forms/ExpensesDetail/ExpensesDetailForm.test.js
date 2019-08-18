import React from 'react';
import ExpensesDetailForm from './ExpensesDetailForm';

describe('<ExpensesDetailForm/>', () => {
  it('should be defined', () => {
    expect(ExpensesDetailForm).toMatchSnapshot();
  });
});
