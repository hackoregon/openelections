import { retrieveAndSaveMatchResultAsync } from '../../services/contributionService';

export default (job: {data: any}): Promise<any> => {
    return retrieveAndSaveMatchResultAsync(job.data.id);
};
