import { getGISCoordinates, retrieveAndSaveMatchResultAsync } from '../../services/contributionService';
import db from '../../models/db';
import { renderError } from '../helpers/addJobs';

export default (job: {data: any}, done: any): Promise<any> => {
    return db().then(async () => {
        await getGISCoordinates(job.data.id);
        await retrieveAndSaveMatchResultAsync(job.data.id);
    })
    .then(() => done())
    .catch(error => {
        console.error(error);
        renderError(error);
        done();
    });
};
