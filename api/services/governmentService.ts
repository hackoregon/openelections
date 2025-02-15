import db from '../models/db';
import { Government } from '../models/entity/Government';

export interface ICreateGovernmentAttrs {
    name: string;
}

export async function createGovernmentAsync(governmentAttrs: ICreateGovernmentAttrs): Promise<Government> {
    const dataSource = await db();
    const governmentRepository = dataSource.getRepository('Government');
    const government = new Government();
    government.name = governmentAttrs.name;
    if (await government.isValidAsync()) {
        await governmentRepository.save(government);
    }
    return government;
}
