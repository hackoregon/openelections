import {createUserAsync} from "../../services/userService";

export default async () => {
    if (process.env.NODE_ENV !== 'development') {
        return console.log('Can only seed in development mode');
    }
    await createUserAsync({
        email: 'dan@civicsoftwarefoundation.org',
        password: 'password',
        firstName: 'Dan',
        lastName: 'Melton'
    });
    await createUserAsync({
        email: 'andrew.erickson@civicsoftwarefoundation.org',
        password: 'password',
        firstName: 'Andrew',
        lastName: 'Erickson'
    });
}
