import db from '../../models/db';
import { createGovernmentAsync } from '../../services/governmentService';
import { truncateAll } from '../factories';

let governmentRepository: any;

describe('governmentService', () => {
    beforeEach(async () => {
        const dataSource = await db();
        governmentRepository = dataSource.getRepository('Government');
    });

    afterEach(async () => {
        await truncateAll();
    });

    it('Creates a valid government', async () => {
        expect(await governmentRepository.count()).toEqual(0);
        await createGovernmentAsync({
            name: 'City of Portland',
        });
        expect(await governmentRepository.count()).toEqual(1);
    });

    it('Does not create a invalid government', async () => {
        expect(await governmentRepository.count()).toEqual(0);
        const government = await createGovernmentAsync({ name: undefined });
        expect(await governmentRepository.count()).toEqual(0);
        expect(government.errors.length).toEqual(1);
    });
});
