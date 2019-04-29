import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { createGovernmentAsync } from '../../services/governmentService';

let governmentRepository: any;

describe('governmentService', () => {
    before(() => {
        governmentRepository = getConnection('default').getRepository('Government');
    });

    afterEach(async() => {
        await governmentRepository.query('TRUNCATE "government" CASCADE');
    });

    it('Creates a valid government', async () => {
        expect(await governmentRepository.count()).equal(0);
        await createGovernmentAsync({
            name: 'City of Portland'
        });
        expect(await governmentRepository.count()).equal(1);
    });

    it('Does not create a invalid government', async () => {
        expect(await governmentRepository.count()).equal(0);
        const government = await createGovernmentAsync({name: undefined});
        expect(await governmentRepository.count()).equal(0);
        expect(government.errors.length).to.equal(1);
    });
});
