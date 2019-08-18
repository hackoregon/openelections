import React from 'react';
import { shallow } from 'enzyme';
import AddExpense from './AddExpense';

describe('<AddExpense/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<AddExpense />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
