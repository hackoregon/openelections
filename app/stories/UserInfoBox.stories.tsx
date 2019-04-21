import * as React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, optionsKnob as options, OptionsKnobOptions } from '@storybook/addon-knobs';
import UserInfoBox, { UserInfoBoxProps } from '../src/components/UserInfoBox';
import { MemoryRouter } from 'react-router';

// import { withKnobs } from '@storybook/addon-knobs/react';

const data: UserInfoBoxProps = {
    role: 'admin',
    name: 'Andrew',
    email: 'Andy@email.com',
    isVerified: true,
};

const label = 'Role';
const valuesObj = {
    Admin: 'admin',
    Staff: 'staff',
};
const defaultValue = 'admin';
const optionsObj: OptionsKnobOptions = {
    display: 'select'
};

export default () => storiesOf('Doohicky', module)
    .addDecorator(withKnobs)
    .addDecorator((story: any) =>
        <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    )
    .add('User Info Box',
        () => {
            const role = options(label, valuesObj, defaultValue, optionsObj);
            const name = text( "name", data.name);
            const email = text( "email", data.email);
            const isVerified = boolean( "isVerified", data.isVerified);

            return (<UserInfoBox {...({name, role, email, isVerified} as UserInfoBoxProps)} />);
        }


    );
