import UserSeed from './users'
import db from "../db";

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        console.log('Can only seed in development mode');
        return
    }
    await db();
    const promises = [];
    promises.push(UserSeed());
    await Promise.all(promises);
    console.log('Database seeded');
    process.exit()
})();


