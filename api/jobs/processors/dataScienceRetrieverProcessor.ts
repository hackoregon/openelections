import { getGISCoordinates, retrieveAndSaveMatchResultAsync } from '../../services/contributionService';
import db from '../../models/db';

export default async (job: {data: any}): Promise<any> => {
    if (process.env.APP_ENV === 'production') {
        await db();
        await getGISCoordinates(job.data.id);
        return await retrieveAndSaveMatchResultAsync(job.data.id);
    } else {
        console.log('Not sending job in staging.');
        return;
    }
};
