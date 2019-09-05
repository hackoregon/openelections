import React from 'react';
import { shallow } from 'enzyme';
import Expenses from './Expenses';

describe('<Expenses/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<Expenses />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
