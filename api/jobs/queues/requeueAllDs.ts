import db from '../../models/db';
import { getConnection } from 'typeorm';
import { Contribution } from '../../models/entity/Contribution';
import { dataScienceResultQueue } from './index';

export async function requeueDataScienceJobs() {
    await db();
    const rep = getConnection().getRepository('Contribution');
    const contr = await rep.find();
    const promises = [];
    contr.forEach( (contr: Contribution) => {
        dataScienceResultQueue.add({id: contr.id});
        console.log(`Queued Datascience job for Contribution ${contr.id}`);
    });
    await Promise.all(promises);
    return;
}
