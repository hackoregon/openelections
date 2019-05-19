import UserSeed from './users';
import db from '../db';
import { truncateAll } from '../../test/factories';

(async () => {
    if (process.env.NODE_ENV === 'production') {
        console.log('Can only seed in test, qa, or development mode');
        return;
    }
    await db();
    await truncateAll();
    const promises = [];
    promises.push(UserSeed());
    await Promise.all(promises);
    console.log('Database seeded');
    process.exit();
})();
