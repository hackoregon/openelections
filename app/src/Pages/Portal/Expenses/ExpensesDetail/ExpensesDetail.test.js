import React from 'react';
import { shallow } from 'enzyme';
import ExpensesDetail from './ExpensesDetail';

describe('<ExpensesDetail/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<ExpensesDetail match={{ params: { id: 1 } }} />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
