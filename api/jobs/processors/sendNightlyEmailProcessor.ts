
import db from '../../models/db';
import { sendActivityEmailToCampaignAdminsAsync } from '../../services/emailService';

export default async (job: { data: any }): Promise<any> => {
    await db();
    return await sendActivityEmailToCampaignAdminsAsync(job.data.id);
};
