import * as express from 'express';
import { expect } from 'chai';
import * as faker from 'faker';
import * as request from 'supertest';
import { setupRoutes } from '../../../routes';
import { User } from '../../../models/entity/User';
import {
    newActiveUserAsync,
    newCampaignAsync,
    newGovernmentAsync,
    newInactiveUserAsync,
    truncateAll
} from '../../factories';
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

describe('Routes /users', () => {
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

    context('/users/invite', () => {
        it('fails, user does not have permission for government', async () => {

            const response = await request(app)
                .post('/users/invite')
                .send({
                        email: faker.internet.email(),
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName(),
                        governmentId: government.id,
                        role: UserRole.GOVERNMENT_ADMIN
                    })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('user does not have sufficient permissions');
        });

        it('fails, user does not have permission for campaign', async () => {
            const response = await request(app)
                .post('/users/invite')
                .send({
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    campaignId: campaign.id,
                    role: UserRole.CAMPAIGN_STAFF
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('user does not have sufficient permissions');
        });

        it('succeeds, invite to government', async () => {
            const response = await request(app)
                .post('/users/invite')
                .send({
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    governmentId: government.id,
                    role: UserRole.GOVERNMENT_ADMIN
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(201);
        });

        it('succeeds, govAdmin invite to campaign testme', async () => {
            const response = await request(app)
                .post('/users/invite')
                .send({
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    campaignId: campaign.id,
                    role: UserRole.CAMPAIGN_STAFF
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(201);
        });

        it('succeeds, campaignAdmin invite to campaign', async () => {
            const response = await request(app)
                .post('/users/invite')
                .send({
                    email: faker.internet.email(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    campaignId: campaign.id,
                    role: UserRole.CAMPAIGN_STAFF
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignAdminToken}`]);
            expect(response.status).to.equal(201);
        });
    });

    context('/users/resend-invite', () => {
        it('succeeds, invite to government', async () => {
            const newUser = await newInactiveUserAsync();
            let response = await request(app)
                .post('/users/invite')
                .send({
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    governmentId: government.id,
                    role: UserRole.GOVERNMENT_ADMIN
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(201);
            response = await request(app)
                .post('/users/resend-invite')
                .send({
                    userId: newUser.id
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(200);
        });

        it('fails, no user', async () => {
            const response = await request(app)
                .post('/users/resend-invite')
                .send({
                    userId: 1100
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('Could not find any entity of type "User" matching: 1100');
        });

        it('fails, user already accepted', async () => {
            const response = await request(app)
                .post('/users/resend-invite')
                .send({
                    userId: govAdmin.id
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('User is already in the system or there is no invitation code');
        });
    });
});
