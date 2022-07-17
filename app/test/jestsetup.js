import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import fetch from 'fetch-vcr';
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;

fetch.configure({
  fixturePath: './test/recordings',
  mode: 'cache',
});

global.fetch = fetch;

HTMLCanvasElement.prototype.getContext = () => jest.fn();
