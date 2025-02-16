import db from '../../models/db';
import { Contribution } from '../../models/entity/Contribution';
import { dataScienceResultQueue } from './index';

export async function requeueDataScienceJobs() {
    const dataSource = await db();
    const rep = dataSource.getRepository('Contribution');
    const contr = await rep.find();
    const promises = [];
    contr.forEach((contr: Contribution) => {
        dataScienceResultQueue.add({ id: contr.id });
        console.log(`Queued Datascience job for Contribution ${contr.id}`);
    });
    await Promise.all(promises);
    return;
}
