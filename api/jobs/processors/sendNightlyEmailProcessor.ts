import db from '../../models/db';
import { sendActivityEmailToCampaignAdminsAsync } from '../../services/emailService';

export default async (job: { data: any }): Promise<any> => {
    if (process.env.APP_ENV === 'production') {
        await db();
        return await sendActivityEmailToCampaignAdminsAsync(job.data.id);
    } else {
        console.log('Not sending job in staging.');
        return;
    }
};
