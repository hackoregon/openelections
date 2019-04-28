import { Government } from '../models/entity/Government';
import { getConnection } from 'typeorm';

export interface ICreateGovernment {
    name: string;
}

export function createGovernmentAsync(governmentAttrs: ICreateGovernment): Promise<Government> {
    const governmentRepository = getConnection('default').getRepository('Government');
    const government = new Government();
    government.name = governmentAttrs.name;
    return governmentRepository.save(government);

}
