import { truncateAll } from '../../test/factories';
import Seed from './seeds';

export async function seedDb() {
    if (process.env.NODE_ENV === 'production' && process.env.APP_ENV === 'production') {
        console.log('Can only seed in test, qa, or development mode');
        return;
    }
    console.log('Database seeding');
    await truncateAll();
    const promises = [];
    promises.push(Seed(true));
    await Promise.all(promises);
    return { message: 'seeded'};
}
