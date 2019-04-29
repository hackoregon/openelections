import { Government } from '../models/entity/Government';
import { getConnection } from 'typeorm';

export interface ICreateGovernmentAttrs {
    name: string;
}

export async function createGovernmentAsync(governmentAttrs: ICreateGovernmentAttrs): Promise<Government> {
    const governmentRepository = getConnection('default').getRepository('Government');
    const government = new Government();
    government.name = governmentAttrs.name;
    if (await government.isValidAsync()) {
        await governmentRepository.save(government);
    }
    return government;
}
