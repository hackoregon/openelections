import React from 'react';
import { shallow } from 'enzyme';
import AddContribution from './AddContribution';

describe('<AddContribution/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<AddContribution />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
