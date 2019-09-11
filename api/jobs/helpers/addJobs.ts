import { dataScienceResultQueue } from '../queues';
import { gisQueue } from '../queues';

export async function addDataScienceJob(jobData: {id: number}) {
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    await dataScienceResultQueue.add(jobData);
    return;
}

export async function addGisJob(jobData: {id: number}) {
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    await gisQueue.add(jobData);
    return;
}

export function renderError(e: Error): any {
    return {
        stack: e.stack,
        message: e.message,
        name: e.name
    };
}
