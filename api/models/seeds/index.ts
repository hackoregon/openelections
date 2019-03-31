import UserSeed from './users'

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        console.log('Can only seed in development mode');
        return
    }
    const promises = [];
    promises.push(UserSeed());
    await Promise.all(promises);
    console.log('Database seeded');
    process.exit()
})();


