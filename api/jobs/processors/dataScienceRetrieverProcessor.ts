import { retrieveAndSaveMatchResultAsync } from '../../services/contributionService';
import db from '../helpers/db';

export default (job: {data: any}): Promise<any> => {
    return db().then(() => {
        return retrieveAndSaveMatchResultAsync(job.data.id).then(() => `Completed Datascience job for record ${job.data.id}`);
    });
};
