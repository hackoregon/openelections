import { config, dataScienceResultQueue, sendNightlyEmailQueue, cronNightlyEmailQueue } from './queues';
import { dataScienceRetrieverProcessor, nightEmailProcessor, cronEmailProcessor } from './processors';

dataScienceResultQueue.process(config.concurrency, dataScienceRetrieverProcessor);
sendNightlyEmailQueue.process(config.concurrency, nightEmailProcessor);
cronNightlyEmailQueue.process(config.concurrency, cronEmailProcessor);

(async function () {
    try {
        let cron = '15 3 * * *';
        if (process.env.APP_ENV !== 'production') {
           cron = '*/5 * * * *';
        }
        console.log('Setting up nightly email activity cron');
        await cronNightlyEmailQueue.add({}, {
            jobId: 1200,
            repeat: {cron}
        });
        console.log('Set up nightly email activity cron');

    } catch (error) {
        console.error('Error setting up nightlyEmailActivityCron', error);
    }
})();

