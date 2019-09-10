import { dataScienceResultQueue } from '../queues';
import { gisQueue } from '../queues';

export async function addDataScienceJob(jobData: {id: number}) {
    await dataScienceResultQueue.add(jobData);
    return;
}

export async function addGisJob(jobData: {id: number}) {
    await gisQueue.add(jobData);
    return;
}
