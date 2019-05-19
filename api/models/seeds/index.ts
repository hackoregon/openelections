import UserSeed from './users';
import GovernmentSeed from './governments';
import PermissionSeed from './permissions';
import db from '../db';

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        console.log('Can only seed in development mode');
        return;
    }
    await db();
    const [users, governments] = await Promise.all([UserSeed(), GovernmentSeed()]);
    await Promise.all([PermissionSeed({ users, governments })]);
    process.exit();
})();
