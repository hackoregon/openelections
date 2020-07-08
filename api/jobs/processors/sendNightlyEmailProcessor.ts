import db from '../helpers/db';
import { sendActivityEmailToCampaignAdminsAsync } from '../../services/emailService';
import { renderError } from '../helpers/addJobs';

export default (job: { data: any }, done: any): Promise<any> => {
    return db().then(async () => {
        await sendActivityEmailToCampaignAdminsAsync(job?.data?.id);
    })
    .then(() => done())
    .catch(error => {
        console.error(error);
        renderError(error);
        done();
    });
};
