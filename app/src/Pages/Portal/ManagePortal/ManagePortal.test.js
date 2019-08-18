import React from 'react';
import { shallow } from 'enzyme';
import ManagePortal from './ManagePortal';

describe('<ManagePortal/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<ManagePortal userList={['one', 'two']} />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
