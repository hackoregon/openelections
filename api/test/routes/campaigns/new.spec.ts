import * as express from 'express';
import { faker } from '@faker-js/faker';
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

    describe('/campaigns/new', () => {
        it('fails, user does not have permission to create campaign', async () => {
            const response = await request(app)
                .post('/campaigns/new')
                .send({
                    name: `${faker.person.lastName()} for Mayor`,
                    governmentId: government.id,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('User is not an admin for the provided government');
        });

        it('fails, campaign name is missing', async () => {
            const response = await request(app)
                .post('/campaigns/new')
                .send({
                    governmentId: government.id,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('name must be a string');
        });

        it('fails, government id is missing', async () => {
            const response = await request(app)
                .post('/campaigns/new')
                .send({
                    name: `${faker.person.lastName()} for Mayor`,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual(
                'governmentId must be a number conforming to the specified constraints'
            );
        });

        it('fails, no token set', async () => {
            const response = await request(app)
                .post('/campaigns/new')
                .send({
                    name: `${faker.person.lastName()} for Mayor`,
                    governmentId: government.id,
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('No token set');
        });

        it('succeeds, govAdmin creates new campaign', async () => {
            const response = await request(app)
                .post('/campaigns/new')
                .send({
                    name: `${faker.person.lastName()} for Mayor`,
                    governmentId: government.id,
                    officeSought: 'Mayor',
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(201);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.anything(),
                    name: expect.anything(),
                    governmentId: expect.anything(),
                    officeSought: expect.anything(),
                })
            );
        });

        it('succeeds, govAdmin creates new campaign with new user', async () => {
            const response = await request(app)
                .post('/campaigns/new')
                .send({
                    name: `${faker.person.lastName()} for Mayor`,
                    governmentId: government.id,
                    firstName: faker.person.firstName(),
                    officeSought: 'Mayor',
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(201);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.anything(),
                    name: expect.anything(),
                    governmentId: expect.anything(),
                    officeSought: expect.anything(),
                })
            );
        });
    });
});
