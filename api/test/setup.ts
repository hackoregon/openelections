import db from '../models/db';

before(async () => {
    if (!((global as any).dbConnection)) {
        (global as any).dbConnection  = await db();
    }
    if (!((global as any).externalContributionCounter)) {
        (global as any).externalContributionCounter = 0;
    }
});
