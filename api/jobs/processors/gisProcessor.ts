import { getGISCoordinates } from '../../services/contributionService';

export default (job: {data: any}): Promise<any> => {
    return getGISCoordinates(job.data.id);
};
