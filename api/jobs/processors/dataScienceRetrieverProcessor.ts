import { getGISCoordinates, retrieveAndSaveMatchResultAsync } from '../../services/contributionService';
import db from '../../models/db';

export default async (job: { data: any }): Promise<any> => {
    console.log('*******************');
    console.log('dataScienceRetrieverProcessor', JSON.stringify(job));
    console.log('*******************');
    await db();
    await getGISCoordinates(job.data.id);
    return await retrieveAndSaveMatchResultAsync(job.data.id);
};
