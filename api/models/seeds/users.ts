import db from '../index'
import {createUserAsync} from "../../services/UserService";

db.then( async connection => {
    await createUserAsync({
        email: 'dan@civicsoftwarefoundation.org',
        password: 'password',
        firstName: 'Dan',
        lastName: 'Melton'
    })
    console.log('User created')
});
