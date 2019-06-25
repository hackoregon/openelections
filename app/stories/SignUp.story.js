import * as React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { withKnobs, object } from '@storybook/addon-knobs';
import SignUp from "../src/Pages/SignUp/SignUp";

export default () => storiesOf('Forms', module)
	.add('Sign Up Form', () => <SignUp />)