import db from '../helpers/db';
import { sendActivityEmailToCampaignAdminsAsync } from '../../services/emailService';

export default (job: { data: any }, done: any): Promise<any> => {
    return db().then(async () => {
        await sendActivityEmailToCampaignAdminsAsync(job.data.id);
    }).then(() => done());
};
