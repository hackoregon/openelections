import { dataScienceResultQueue } from '../queues';

async function addJobToDataScienceResultQueue(jobData) {
    await dataScienceResultQueue.add(jobData);
    return;
}

export default addJobToDataScienceResultQueue;
