import { createUserAsync } from '../../services/userService';

const seeds = [
    {
        email: 'dan@civicsoftwarefoundation.org',
        password: 'password',
        firstName: 'Dan',
        lastName: 'Melton'
    },
    {
        email: 'andrew.erickson@civicsoftwarefoundation.org',
        password: 'password',
        firstName: 'Andrew',
        lastName: 'Erickson'
    },
    {
        email: 'ian.harris@hackoregon.org',
        password: 'password',
        firstName: 'Ian',
        lastName: 'Harris'
    }
];

export default async () => {
    if (process.env.NODE_ENV !== 'development') {
        return console.log('Can only seed in development mode');
    }
    return Promise.all(seeds.map(createUserAsync));
};
