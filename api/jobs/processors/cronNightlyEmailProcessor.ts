import db from '../helpers/db';
import { getConnection } from 'typeorm';
import { Campaign } from '../../models/entity/Campaign';
import { sendNightlyEmailQueue } from '../queues';

export default (job: { data: any }, done: any): Promise<any> => {
    return db().then(async () => {
        const campaignRepository = getConnection('default').getRepository('Campaign');
        const campaigns = await campaignRepository.find() as Campaign[];
        const promises = [];
        campaigns.forEach((campaign: Campaign): void => {
            promises.push(sendNightlyEmailQueue.add({id: campaign.id}, {attempts: 1}));
        });
        return Promise.all(promises);
    }).then(() => done());
};