import Seed from './seeds';
import db from '../db';
import { truncateAll } from '../../test/factories';

(async () => {
    if (process.env.NODE_ENV === 'production' && process.env.APP_ENV === 'production') {
        console.log('Can only seed in test, qa, or development mode');
        return;
    }
    console.log('Database seeding');
    await db();
    await truncateAll();
    const promises = [];
    promises.push(Seed());
    await Promise.all(promises);
    console.log('Database seeded');
    process.exit();
})();

export async function seed() {
    if (process.env.NODE_ENV === 'production' && process.env.APP_ENV === 'production') {
        console.log('Can only seed in test, qa, or development mode');
        return;
    }
    console.log('Database seeding');
    await truncateAll();
    const promises = [];
    promises.push(Seed());
    await Promise.all(promises);
    return { message: 'seeded'};
}
