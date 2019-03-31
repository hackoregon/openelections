import db from '../db'
import {createUserAsync} from "../../services/UserService";

export default () => db.then( async connection => {
    if (process.env.NODE_ENV !== 'development') {
        return console.log('Can only seed in development mode');
    }
    await createUserAsync({
        email: 'dan@civicsoftwarefoundation.org',
        password: 'password',
        firstName: 'Dan',
        lastName: 'Melton'
    });
    console.log('User created');
});
