import React from 'react';
import { shallow } from 'enzyme';
import ManageCampaign from './ManageCampaign';

describe('<ManageCampaign/>', () => {
  it('should be defined', () => {
    const wrapper = shallow(<ManageCampaign userList={['one', 'two']} />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
