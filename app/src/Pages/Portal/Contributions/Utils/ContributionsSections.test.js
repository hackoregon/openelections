import React from 'react';
import { shallow } from 'enzyme';
import {
  OtherDetailsSection,
  ContributorSection,
  BasicsSection,
  AddHeaderSection,
} from './ContributionsSections';

describe('<OtherDetailsSection />', () => {
  it('should be defined', () => {
    const wrapper = shallow(<OtherDetailsSection formFields={{}} />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});

describe('<ContributorSection />', () => {
  it('should be defined', () => {
    const wrapper = shallow(<ContributorSection formFields={{}} />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});

describe('<BasicsSection />', () => {
  it('should be defined', () => {
    const wrapper = shallow(<BasicsSection formFields={{}} />);
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});

describe('<HeaderSection />', () => {
  it('should be defined', () => {
    const wrapper = shallow(
      <AddHeaderSection isValid={false} handleSubmit={() => {}} />
    );
    expect(wrapper).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
