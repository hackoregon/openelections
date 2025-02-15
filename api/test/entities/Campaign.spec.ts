import db from '../../models/db';
import { Campaign } from '../../models/entity/Campaign';
import { Government } from '../../models/entity/Government';
import { truncateAll } from '../factories';

let campaignRepository: any;
let governmentRepository: any;
let government: Government;

describe('Campaign', () => {
    beforeAll(async () => {
        const testDb = await db();
        campaignRepository = testDb.getRepository('Campaign');
        governmentRepository = testDb.getRepository('Government');
        government = new Government();
        government.name = 'City of Portland';
        await governmentRepository.save(government);
    });

    afterEach(async () => {
        await campaignRepository.query('TRUNCATE "campaign" CASCADE');
    });

    afterAll(async () => {
        await truncateAll();
    });

    describe('Validations', () => {
        it('name testme', async () => {
            const campaign = new Campaign();
            await campaign.validateAsync();
            expect(campaign.errors.length).toEqual(3);
            expect(campaign.errors[0].property).toEqual('name');
            expect(campaign.errors[0].constraints.isDefined).toEqual('name should not be null or undefined');
        });

        it('officeSought', async () => {
            const campaign = new Campaign();
            campaign.name = 'Melton for Mayor';
            await campaign.validateAsync();
            expect(campaign.errors.length).toEqual(2);
            expect(campaign.errors[0].property).toEqual('officeSought');
            expect(campaign.errors[0].constraints.isDefined).toEqual('officeSought should not be null or undefined');
        });

        it('government', async () => {
            const campaign = new Campaign();
            campaign.name = 'Melton for Mayor';
            campaign.officeSought = 'Mayor';
            await campaign.validateAsync();
            expect(campaign.errors.length).toEqual(1);
            expect(campaign.errors[0].property).toEqual('governmentId');
            expect(campaign.errors[0].constraints.isDefined).toEqual('governmentId should not be null or undefined');
        });

        it('isValid', async () => {
            const campaign = new Campaign();
            expect(await campaign.isValidAsync()).toBeFalsy();
            campaign.name = 'City of Portland';
            campaign.government = government;
            campaign.officeSought = 'Mayor';
            expect(await campaign.isValidAsync()).toBeTruthy();
        });

        it('validate throws error', async () => {
            const campaign = new Campaign();
            try {
                await campaignRepository.save(campaign);
            } catch (e) {
                expect(e.message).toEqual('campaign has one or more validation problems');
            }
        });

        it('validate does not throws error', async () => {
            const campaign = new Campaign();
            campaign.name = 'City of Portland';
            campaign.government = government;
            campaign.officeSought = 'Mayor';
            expect(await campaignRepository.count()).toEqual(0);
            await campaignRepository.save(campaign);
            expect(await campaignRepository.count()).toEqual(1);
        });
    });

    describe('JSON', () => {
        it('toJson', async () => {
            const campaign = new Campaign();
            campaign.name = 'Melton for Mayor';
            campaign.government = government;
            campaign.officeSought = 'Mayor';
            await campaignRepository.save(campaign);
            const campaignJson = campaign.toJSON();
            expect(campaignJson.id).toBeDefined();
            expect(campaignJson.name).toEqual('Melton for Mayor');
            expect(campaignJson.governmentId).toEqual(government.id);
            expect(campaignJson.officeSought).toEqual('Mayor');
        });
    });
});
