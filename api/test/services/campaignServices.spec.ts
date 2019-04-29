import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { createGovernmentAsync } from '../../services/governmentService';
import { Government } from '../../models/entity/Government';
import { createCampaignAsync } from '../../services/campaignService';

let governmentRepository: any;
let campaignRepository: any;
let government: Government;

describe('campaignServices', () => {
    before(async () => {
        governmentRepository = getConnection('default').getRepository('Government');
        campaignRepository = getConnection('default').getRepository('Campaign');
        government = await createGovernmentAsync({
            name: 'City of Portland'
        });
    });

    afterEach(async() => {
        await campaignRepository.query('TRUNCATE "campaign" CASCADE');
    });

    it('Creates a valid campaign', async () => {
        expect(await campaignRepository.count()).equal(0);
        await createCampaignAsync({
            name: 'Melton for Mayor',
            governmentId: government.id,
        });
        expect(await campaignRepository.count()).equal(1);
    });

    it('Does not create a invalid campaign', async () => {
        expect(await campaignRepository.count()).equal(0);
        const campaign = await createCampaignAsync({name: 'Melton for Mayor', governmentId: 100000});
        expect(await campaignRepository.count()).equal(0);
        expect(campaign.errors.length).to.equal(1);
    });
});
