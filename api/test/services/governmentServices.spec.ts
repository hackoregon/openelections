import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { createGovernmentAsync } from '../../services/governmentService';

let governmentRepository: any;
let permissionRepository: any;
let campaignRepository: any;

describe('governmentService', () => {
    before(() => {
        governmentRepository = getConnection('default').getRepository('Government');
        permissionRepository  = getConnection('default').getRepository('Permission');
        campaignRepository  = getConnection('default').getRepository('Campaign');
    });

    afterEach(async() => {
        await permissionRepository.clear();
        await campaignRepository.clear();
        await governmentRepository.clear();
    });

    it('Creates the user', async () => {
        expect(await governmentRepository.count()).equal(0);
        const user = await createGovernmentAsync({
            name: 'City of Portland'
        });
        expect(await governmentRepository.count()).equal(1);
    });
});
