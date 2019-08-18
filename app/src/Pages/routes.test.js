import React from 'react';
import { shallow } from 'enzyme';
import Routes from './routes';

describe('<Routes/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<Routes />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
