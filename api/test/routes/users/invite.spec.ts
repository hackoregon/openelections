import * as express from 'express';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { setupRoutes } from '../../../routes';
import { User } from '../../../models/entity/User';
import {
    newActiveUserAsync,
    newCampaignAsync,
    newGovernmentAsync,
    newInactiveUserAsync,
    truncateAll,
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
    beforeAll(async () => {
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
            role: UserRole.CAMPAIGN_STAFF,
        });

        await addPermissionAsync({
            userId: campaignAdmin.id,
            campaignId: campaign.id,
            role: UserRole.CAMPAIGN_ADMIN,
        });

        await addPermissionAsync({
            userId: govAdmin.id,
            governmentId: government.id,
            role: UserRole.GOVERNMENT_ADMIN,
        });

        govAdminToken = await generateJWTokenAsync(govAdmin.id);
        campaignStaffToken = await generateJWTokenAsync(campaignStaff.id);
        campaignAdminToken = await generateJWTokenAsync(campaignAdmin.id);
    });

    afterEach(async () => {
        await truncateAll();
    });

    describe('/users/invite', () => {
        it('fails, user does not have permission for government', async () => {
            const response = await request(app)
                .post('/users/invite')
                .send({
                    email: faker.internet.email(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    governmentId: government.id,
                    role: UserRole.GOVERNMENT_ADMIN,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('user does not have sufficient permissions');
        });

        it('fails, user does not have permission for campaign', async () => {
            const response = await request(app)
                .post('/users/invite')
                .send({
                    email: faker.internet.email(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    campaignId: campaign.id,
                    role: UserRole.CAMPAIGN_STAFF,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('user does not have sufficient permissions');
        });

        it('succeeds, invite to government', async () => {
            const response = await request(app)
                .post('/users/invite')
                .send({
                    email: faker.internet.email(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    governmentId: government.id,
                    role: UserRole.GOVERNMENT_ADMIN,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(201);
        });

        it('succeeds, govAdmin invite to campaign testme', async () => {
            const response = await request(app)
                .post('/users/invite')
                .send({
                    email: faker.internet.email(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    campaignId: campaign.id,
                    role: UserRole.CAMPAIGN_STAFF,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(201);
        });

        it('succeeds, campaignAdmin invite to campaign', async () => {
            const response = await request(app)
                .post('/users/invite')
                .send({
                    email: faker.internet.email(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    campaignId: campaign.id,
                    role: UserRole.CAMPAIGN_STAFF,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignAdminToken}`]);
            expect(response.status).toEqual(201);
        });
    });

    describe('/users/resend-invite', () => {
        it('succeeds, invite to government', async () => {
            const newUser = await newInactiveUserAsync();
            let response = await request(app)
                .post('/users/invite')
                .send({
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    governmentId: government.id,
                    role: UserRole.GOVERNMENT_ADMIN,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(201);
            response = await request(app)
                .post('/users/resend-invite')
                .send({
                    userId: newUser.id,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(204);
        });

        it('fails, no user', async () => {
            const response = await request(app)
                .post('/users/resend-invite')
                .send({
                    userId: 1100,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('Could not find any entity of type "User" matching: 1100');
        });

        it('fails, user already accepted', async () => {
            const response = await request(app)
                .post('/users/resend-invite')
                .send({
                    userId: govAdmin.id,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('User is already in the system or there is no invitation code');
        });
    });

    describe('/users/redeem-invite', () => {
        it('succeeds', async () => {
            const newUser = await newInactiveUserAsync();
            const response = await request(app)
                .post('/users/redeem-invite')
                .send({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    password: 'newpassword',
                    invitationCode: newUser.invitationCode,
                })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(204);
        });

        it('fails, invitationCode not found', async () => {
            const newUser = await newInactiveUserAsync();
            const response = await request(app)
                .post('/users/redeem-invite')
                .send({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    password: 'newpassword',
                    invitationCode: 111111,
                })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual(
                'Could not find any entity of type "User" matching invitationCode: 111111'
            );
        });

        it('fails, password not correct', async () => {
            const newUser = await newInactiveUserAsync();
            const response = await request(app)
                .post('/users/redeem-invite')
                .send({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    password: 'p',
                    invitationCode: newUser.invitationCode,
                })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('User password must be at least 6 characters');
        });
    });
});
