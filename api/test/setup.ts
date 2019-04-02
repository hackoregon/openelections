import db from '../models/db';

before(async () => {
    if (!((global as any).dbConnection)) {
        (global as any).dbConnection  = await db();
    }
});
