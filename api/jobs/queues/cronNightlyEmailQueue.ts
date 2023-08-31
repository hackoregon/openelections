import * as Bull from 'bull';
import config from './config';
import { renderError } from '../helpers/addJobs';

const queue = (() => {
    if (process.env.NODE_ENV !== 'test') {
        return new Bull('cron-email-scheduler', config.redis);
    }
    return;
})();

if (queue) {
    queue
        .on('waiting', (jobId) => console.debug(`CNEQ, waiting id=${jobId}`))
        .on('active', (job) => console.debug(`CNEQ, active id=${job.id}`))
        .on('completed', (job, result) => console.debug(`CNEQ, completed(${result}) id=${job.id}`))
        .on('failed', (job, err) => console.warn(`CNEQ, failed(${err}) id=${job.id}`, { job, e: renderError(err) }))
        .on('error', (job: any, err: Error) => console.error(`CNEQ, error ${err}`, { job, e: renderError(err) }))
        .on('stalled', (job) => console.warn(`CNEQ, stalled id=${job.id}`));
}

export default queue;
