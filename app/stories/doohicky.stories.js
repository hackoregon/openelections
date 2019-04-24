import * as React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import Doohicky from '../src/components/Doohicky/index';
import Provider from './Provider';

// import { withKnobs } from '@storybook/addon-knobs/react';

export default () => storiesOf('Doohicky', module)
    .addDecorator((story) => <Provider story={story()} />)
    .add(
  'basic PrimaryButton',
  () => (
    <Doohicky />
  ),
  {
    info: {
      text: `

  ### Notes

  light button seen on <https://zpl.io/aM49ZBd>

  ### Usage
  ~~~js
  <PrimaryButton
    label={text('label', 'Enroll')}
    disabled={boolean('disabled',false)}
    onClick={() => alert('hello there')}
  />
  ~~~

`,
    },
  }
);
