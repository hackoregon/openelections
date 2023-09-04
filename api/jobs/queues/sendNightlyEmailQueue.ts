import * as Bull from 'bull';
import config from './config';
import { renderError } from '../helpers/addJobs';

const queue = (() => {
    if (process.env.NODE_ENV !== 'test') {
        return new Bull('nightly-email', config.redis);
    }
    return;
})();

if (queue) {
    queue
        .on('waiting', (jobId) => console.debug(`SNEQ, waiting id=${jobId}`))
        .on('active', (job) => console.debug(`SNEQ, active id=${job.id}`))
        .on('completed', (job, result) => console.debug(`SNEQ, completed(${result}) id=${job.id}`))
        .on('failed', (job, err) => console.warn(`SNEQ, failed(${err}) id=${job.id}`, { job, e: renderError(err) }))
        .on('error', (job: any, err: Error) => console.error(`SNEQ, error ${err}`, { job, e: renderError(err) }))
        .on('stalled', (job) => console.warn(`SNEQ, stalled id=${job.id}`));
}

export default queue;
