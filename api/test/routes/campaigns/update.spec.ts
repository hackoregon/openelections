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

let app: express.Express;
let campaignStaff: User;
let campaignAdmin: User;
let govAdmin: User;
let government: Government;
let campaign: Campaign;
let govAdminToken: string;
let campaignAdminToken: string;
let campaignStaffToken: string;

describe('Routes /campaigns', () => {
    before(async () => {
        app = express();
        setupRoutes(app);
    });

    beforeEach(async () => {
        campaignStaff = await newActiveUserAsync();
        campaignAdmin = await newActiveUserAsync();
        govAdmin = await newActiveUserAsync();

        government = await newGovernmentAsync();
        campaign = await newCampaignAsync(government);

        await addPermissionAsync({
            userId: campaignStaff.id,
            campaignId: campaign.id,
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
        campaignStaffToken = await generateJWTokenAsync(campaignStaff.id);
        campaignAdminToken = await generateJWTokenAsync(campaignAdmin.id);
    });

    afterEach(async () => {
        await truncateAll();
    });

    context('/campaigns/update', () => {
        it('fails, user does not have permission to create campaign', async () => {
            const response = await request(app)
                .post('/campaigns/update')
                .send({
                    newName: `${faker.name.lastName()} for Mayor`,
                    governmentId: government.id,
                    campaignId: campaign.id
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('User is not an admin for the provided government');
        });

        it('fails, campaigns newName is missing and so is campaignId', async () => {
            const response = await request(app)
                .post('/campaigns/update')
                .send({
                    governmentId: government.id
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('newName must be a string, campaignId must be a number');
        });

        it('fails, government id is missing', async () => {
            const response = await request(app)
                .post('/campaigns/update')
                .send({
                    newName: `${faker.name.lastName()} for Mayor`,
                    campaignId: campaign.id
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('governmentId must be a number');
        });

        it('fails, no token set', async () => {
            const response = await request(app)
                .post('/campaigns/update')
                .send({
                    newName: `${faker.name.lastName()} for Mayor`,
                    governmentId: government.id,
                    campaignId: campaign.id
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('No token set');
        });

        it('succeeds, govAdmin updates campaign name', async () => {
            const response = await request(app)
                .post('/campaigns/update')
                .send({
                    newName: `${faker.name.lastName()} for Mayor`,
                    governmentId: government.id,
                    campaignId: campaign.id
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(201);
            expect(response.body)
                .to.be.an.instanceof(Object)
                .that.includes.all.keys(['id', 'name', 'governmentId', 'officeSought']);
        });
    });
});
