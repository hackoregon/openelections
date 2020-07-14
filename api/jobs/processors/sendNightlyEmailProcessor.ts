import db from '../helpers/db';
import { sendActivityEmailToCampaignAdminsAsync } from '../../services/emailService';
import { renderError } from '../helpers/addJobs';

export default async (job: { data: any }): Promise<any> => {
    await db();
    return await sendActivityEmailToCampaignAdminsAsync(job.data.id);
};
