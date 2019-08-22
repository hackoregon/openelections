import * as express from 'express';
import { expect } from 'chai';
import * as faker from 'faker';
import * as request from 'supertest';
import { setupRoutes } from '../../../routes';
import { User } from '../../../models/entity/User';
import { newActiveUserAsync, newCampaignAsync, newGovernmentAsync, truncateAll } from '../../factories';
import { Government } from '../../../models/entity/Government';
import { Campaign } from '../../../models/entity/Campaign';
import { addPermissionAsync, generateJWTokenAsync } from '../../../services/permissionService';
import { UserRole } from '../../../models/entity/Permission';
import {
    Contribution,
    ContributionType,
    ContributionSubType,
    ContributionStatus,
    ContributorType
} from '../../../models/entity/Contribution';
import { addContributionAsync } from '../../../services/contributionService';

let app: express.Express;
let campaignAdmin2: User;
let campaignAdmin: User;
let govAdmin: User;
let government: Government;
let campaign: Campaign;
let campaign2: Campaign;
let govAdminToken: string;
let campaignAdminToken: string;
let campaignAdmin2Token: string;

describe('Routes post /contributions', () => {
    before(async () => {
        app = express();
        setupRoutes(app);
    });

    beforeEach(async () => {
        campaignAdmin2 = await newActiveUserAsync();
        campaignAdmin = await newActiveUserAsync();
        govAdmin = await newActiveUserAsync();

        government = await newGovernmentAsync();
        campaign = await newCampaignAsync(government);
        campaign2 = await newCampaignAsync(government);

        await addPermissionAsync({
            userId: campaignAdmin2.id,
            campaignId: campaign2.id,
            role: UserRole.CAMPAIGN_STAFF
        });

        await addPermissionAsync({
            userId: campaignAdmin.id,
            campaignId: campaign.id,
            role: UserRole.CAMPAIGN_ADMIN
        });

        await addPermissionAsync({
            userId: govAdmin.id,
            governmentId: government.id,
            role: UserRole.GOVERNMENT_ADMIN
        });

        govAdminToken = await generateJWTokenAsync(govAdmin.id);
        campaignAdminToken = await generateJWTokenAsync(campaignAdmin.id);
        campaignAdmin2Token = await generateJWTokenAsync(campaignAdmin2.id);

        await addContributionAsync({
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign.id,
            city: 'Portland',
            currentUserId: campaignAdmin.id,
            date: Date.now(),
            firstName: 'John',
            middleInitial: '',
            lastName: 'Doe',
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            state: 'OR',
            zip: '97214',
            contributorType: ContributorType.INDIVIDUAL
        });

        await addContributionAsync({
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign2.id,
            city: 'Portland',
            currentUserId: campaignAdmin2.id,
            date: Date.now(),
            firstName: 'John',
            middleInitial: '',
            lastName: 'Doe',
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            state: 'OR',
            zip: '97214',
            contributorType: ContributorType.INDIVIDUAL
        });
    });

    afterEach(async () => {
        await truncateAll();
    });

    context('post /summary', () => {
        it('success as gov admin', async () => {
            const response = await request(app)
                .post(`/summary`)
                .send({ governmentId: government.id, currentUserId: govAdmin.id })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(200);
            expect(response.body.message).to.be.undefined;
            expect(response.body.contributions[0].amount).to.equal(500);
            expect(response.body.contributions[0].total).to.equal(2);
        });

        it('success as campaign admin 1', async () => {
            const response = await request(app)
                .post(`/summary`)
                .send({ campaignId: campaign.id, currentUserId: campaignAdmin.id })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignAdminToken}`]);
            expect(response.status).to.equal(200);
            expect(response.body.contributions[0].amount).to.equal(250);
            expect(response.body.contributions[0].total).to.equal(1);
        });

        it('success as campaign admin 2', async () => {
            const response = await request(app)
                .post(`/summary`)
                .send({ campaignId: campaign2.id, currentUserId: campaignAdmin2.id })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignAdmin2Token}`]);
            expect(response.status).to.equal(200);
            expect(response.body.contributions[0].amount).to.equal(250);
            expect(response.body.contributions[0].total).to.equal(1);
        });

        it('error permissions', async () => {
            const response = await request(app)
                .post(`/summary`)
                .send({ governmentId: government.id, currentUserId: campaignAdmin.id })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignAdminToken}`]);
            expect(response.status).to.equal(422);
        });
    });
});
