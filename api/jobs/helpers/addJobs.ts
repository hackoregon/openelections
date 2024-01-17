import { dataScienceResultQueue } from '../queues';
import { bugsnagClient } from '../../services/bugsnagService';

export async function addDataScienceJob(jobData: { id: number }) {
    if (process.env.NODE_ENV === 'test') {
        return;
    }
    try {
        await dataScienceResultQueue.add(jobData);
        return;
    } catch (error) {
        console.log(error);
        console.log(`${renderError(error)}`);
        return;
    }
}

export function renderError(e: Error): any {
    if (!e) {
        return;
    }
    if (process.env.APP_ENV === 'production') {
        bugsnagClient.notify(e);
    } else {
        console.log(e);
    }
    return {
        stack: e.stack,
        message: e.message,
        name: e.name,
    };
}
