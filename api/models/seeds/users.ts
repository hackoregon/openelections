import db from '../index';
import { createUserAsync } from '../../services/UserService';
import { getManager } from 'typeorm';
import { User } from '../entity/User';

db.then( async connection => {
    // const userManager = getManager().getRepository(User);
    // const users = await userManager.find();
    // console.log('[DEBUG USERS IN DB]: ', users, !users.length);

    // if ( !users.length && users.length < 1 ) {
    //     await initialUserArray.map( async user => {
    //         await createUserAsync(user);
    //         console.log('user added to db', user);
    //     });
    // } else {
    //     console.log('users already seeded');
    // }

    // await createUserAsync({
    //     email: 'dan@civicsoftwarefoundation.org',
    //     password: 'password',
    //     firstName: 'Dan',
    //     lastName: 'Melton'
    // });
    // await createUserAsync({
    //     email: 'andrew.erickson@civicsoftwarefoundation.org',
    //     password: 'password',
    //     firstName: 'Andrew',
    //     lastName: 'Erickson'
    // });
    // console.log('User created');
});

export const initialSeedInit = async connection => {
    const userManager = getManager().getRepository(User);
    const users = await userManager.find();

    if ( !users.length && users.length < 1 ) {
        await initialUserArray.map( async user => {
            await createUserAsync(user);
            console.log('user added to db', user);
        });
    } else {
        console.log('users already seeded');
    }
};

export const initialUserArray = [
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
        email: 'ronnie.mosley@civicsoftwarefoundation.org',
        password: 'password',
        firstName: 'Ronnie',
        lastName: 'Mosely'
    }
];
