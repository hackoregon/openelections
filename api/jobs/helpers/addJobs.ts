import { dataScienceResultQueue } from '../queues';
import { bugsnagClient } from '../../services/bugsnagService';

export async function addDataScienceJob(jobData: {id: number}) {
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    await dataScienceResultQueue.add(jobData);
    return;
}

export function renderError(e: Error): any {
    if (!e) {
        return;
    }
    if (process.env.NODE_ENV === 'production') {
        bugsnagClient.notify(e);
    }
    return {
        stack: e.stack,
        message: e.message,
        name: e.name
    };
}
