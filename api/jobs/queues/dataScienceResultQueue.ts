import * as Bull from 'bull';
import config from './config';
import { renderError } from '../helpers/addJobs';

const queue = (() => {
    if (process.env.NODE_ENV !== 'test') {
        return new Bull('ds-results-retriever', config.redis);
    }
    return;
})();

if (queue) {
    queue
        .on('waiting', (jobId) => console.debug(`DSRQ: waiting id=${jobId}`))
        .on('active', (job) => console.debug(`DSRQ: active id=${job.id}`))
        .on('completed', (job, result) => console.debug(`DSRQ: completed(${result}) id=${job.id}`))
        .on('failed', (job, err) => console.warn(`DSRQ: failed(${err}) id=${job.id}`, { job, e: renderError(err) }))
        .on('error', (job: any, err: Error) => console.error(`DSRQ: error ${err}`, { job, e: renderError(err) }))
        .on('stalled', (job) => console.warn(`DSRQ: stalled id=${job.id}`));
}

export default queue;
