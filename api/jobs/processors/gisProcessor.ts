import { getGISCoordinates } from '../../services/contributionService';
import db from '../helpers/db';

export default (job: {data: any}): Promise<any> => {
    return db().then(() => {
        return getGISCoordinates(job.data.id).then(() => `Completed GIS Job for Contribution ${job.data.id}`);
    })
};
