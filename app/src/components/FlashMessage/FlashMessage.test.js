import React from 'react';
import { shallow } from 'enzyme';
import FlashMessage from './FlashMessage';

describe('<FlashMessage/>', () => {
  it('should be defined', () => {
    // expect(FlashMessage).toMatchSnapshot();
    const wrapper = shallow(<FlashMessage />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
