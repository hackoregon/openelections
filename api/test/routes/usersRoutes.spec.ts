import * as express from 'express';
import { expect } from 'chai';
import * as faker from 'faker';
import * as request from 'supertest';
import { setupRoutes } from '../../routes';
import { User } from '../../models/entity/User';
import { newActiveUserAsync, newCampaignAsync, newGovernmentAsync, truncateAll } from '../factories';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';
import { addPermissionAsync, generateJWTokenAsync } from '../../services/permissionService';
import { UserRole } from '../../models/entity/Permission';

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

    context('/users/login', () => {
        it('email not found', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({password: 'password'})
                .send({email: 'dan@civicsoftwarefoundation.org'})
                .set('Accept', 'application/json');
            expect(response.status).to.equal(401);
            expect(response.body.message).to.equal('No user found with email or password');
        });

        it('password not correct', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({password: 'password1'})
                .send({email: campaignStaff.email})
                .set('Accept', 'application/json');
            expect(response.status).to.equal(401);
            expect(response.body.message).to.equal('No user found with email or password');
        });

        it('success, sets token in cookie', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({password: 'password'})
                .send({email: campaignStaff.email})
                .set('Accept', 'application/json');
            expect(response.status).to.equal(204);

            const regex = /(.*?)=(.*?)($|;|,(?! ))/g;
            const matches = [];
            let match = regex.exec(response.header['set-cookie']);
            while (match != undefined) {
                matches.push(match[1]);
                match = regex.exec(response.header['set-cookie']);
            }
            expect(matches).to.deep.equal([ 'token', ' Path', ' Expires' ]);
        });
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
});
