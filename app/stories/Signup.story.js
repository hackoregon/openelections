import * as React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { withKnobs, object } from '@storybook/addon-knobs';
import Signup from "../src/Pages/Signup/Signup";

export default () => storiesOf('AddUser', module)
	.add('Sign Up Form', () => <Signup />)