import { getGISCoordinates, retrieveAndSaveMatchResultAsync } from '../../services/contributionService';
import db from '../helpers/db';

export default (job: {data: any}, done: any): Promise<any> => {
    return db().then(async () => {
        await getGISCoordinates(job.data.id);
        await retrieveAndSaveMatchResultAsync(job.data.id);
    }).then(() => done());
};
