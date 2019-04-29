import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Campaign } from '../../models/entity/Campaign';
import { Government } from '../../models/entity/Government';

let campaignRepository: any;
let governmentRepository: any;
let government: Government;

describe('Campaign', () => {
    before(async () => {
        campaignRepository = getConnection('default').getRepository('Campaign');
        governmentRepository = getConnection('default').getRepository('Government');
        government = new Government();
        government.name = 'City of Portland';
        await governmentRepository.save(government);
    });

    afterEach(async () => {
        await campaignRepository.query('TRUNCATE "campaign" CASCADE');
    });

    after(async () => {
        await governmentRepository.query('TRUNCATE "government" CASCADE');
    });

    context('Validations', () => {
        it('name', async () => {
            const campaign = new Campaign();
            await campaign.validateAsync();
            expect(campaign.errors.length).to.equal(2);
            expect(campaign.errors[0].property).equal('name');
            expect(campaign.errors[0].constraints.isDefined).equal('name should not be null or undefined');
        });

        it('government', async () => {
            const campaign = new Campaign();
            campaign.name = 'Melton for Mayor';
            await campaign.validateAsync();
            expect(campaign.errors.length).to.equal(1);
            expect(campaign.errors[0].property).equal('governmentId');
            expect(campaign.errors[0].constraints.isDefined).equal('governmentId should not be null or undefined');
        });

        it('isValid', async () => {
            const campaign = new Campaign();
            expect(await campaign.isValidAsync()).to.be.false;
            campaign.name = 'City of Portland';
            campaign.government = government;
            expect(await campaign.isValidAsync()).to.be.true;
        });

        it('validate throws error', async () => {
            const campaign = new Campaign();
            try {
                await campaignRepository.save(campaign);
            } catch (e) {
                expect(e.message).to.equal('campaign has one or more validation problems');
            }
        });

        it('validate does not throws error', async () => {
            const campaign = new Campaign();
            campaign.name = 'City of Portland';
            campaign.government = government;
            expect(await campaignRepository.count()).equal(0);
            await campaignRepository.save(campaign);
            expect(await campaignRepository.count()).equal(1);
        });

    });

    context('JSON', () => {
        it('toJson', async () => {
            const campaign = new Campaign();
            campaign.name = 'Melton for Mayor';
            campaign.government = government;
            await campaignRepository.save(campaign);
            const campaignJson = campaign.toJSON();
            expect(campaignJson.id).to.not.be.undefined;
            expect(campaignJson.name).to.equal('Melton for Mayor');
            expect(campaignJson.governmentId).to.equal(government.id);
        });
    });

});
