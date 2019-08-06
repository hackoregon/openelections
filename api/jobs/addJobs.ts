import { dataScienceResultQueue } from './index';

dataScienceResultQueue.add({contributionId: 12345}).then(() => {
    console.log('done')
});
