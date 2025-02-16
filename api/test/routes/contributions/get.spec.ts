import * as express from 'express';
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
    ContributorType,
    PaymentMethod,
} from '../../../models/entity/Contribution';
import { addContributionAsync } from '../../../services/contributionService';
import { parse } from 'csv-parse/.';

let app: express.Express;
let campaignStaff: User;
let campaignStaff2: User;
let campaignAdmin: User;
let govAdmin: User;
let government: Government;
let campaign: Campaign;
let govAdminToken: string;
let campaignAdminToken: string;
let campaignStaffToken: string;
let campaignStaff2Token: string;
let contribution1: Contribution;

describe('Routes post /contributions', () => {
    beforeAll(async () => {
        app = express();
        setupRoutes(app);
    });

    beforeEach(async () => {
        campaignStaff = await newActiveUserAsync();
        campaignStaff2 = await newActiveUserAsync();
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
        campaignStaff2Token = await generateJWTokenAsync(campaignStaff2.id);

        contribution1 = await addContributionAsync({
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign.id,
            city: 'Portland',
            currentUserId: campaignStaff.id,
            date: Date.now(),
            firstName: 'John',
            middleInitial: '',
            lastName: 'Doe',
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            state: 'OR',
            zip: '97214',
            contributorType: ContributorType.INDIVIDUAL,
        });
    });

    afterEach(async () => {
        await truncateAll();
    });

    describe('post /contributions', () => {
        it('success as gov admin', async () => {
            const response = await request(app)
                .post(`/contributions`)
                .send({ governmentId: government.id, currentUserId: govAdmin.id })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(200);
            expect(response.body.message).toBeUndefined();
        });

        it('success as campaign admin', async () => {
            const response = await request(app)
                .post(`/contributions`)
                .send({ governmentId: government.id, campaignId: campaign.id, currentUserId: campaignAdmin.id })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignAdminToken}`]);
            expect(response.status).toEqual(200);
            expect(response.body.message).toBeUndefined();
        });

        it('success as campaign staff', async () => {
            const response = await request(app)
                .post(`/contributions`)
                .send({ governmentId: government.id, campaignId: campaign.id, currentUserId: campaignStaff.id })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).toEqual(200);
            expect(response.body.message).toBeUndefined();
        });

        it('error permissions', async () => {
            const response = await request(app)
                .post(`/contributions`)
                .send({ governmentId: government.id, currentUserId: campaignAdmin.id })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignAdminToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message);
        });

        it('csv success as gov admin', async () => {
            const response = await request(app)
                .post(`/contributions`)
                .send({ governmentId: government.id, currentUserId: govAdmin.id, format: 'csv' })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(200);
            parse(response.text, { delimiter: ',' }, (err, _records) => {
                expect(err).toBeFalsy();
            });
        });
    });

    describe('get /contributions/:id', () => {
        it('success as gov admin', async () => {
            const response = await request(app)
                .get(`/contributions/${contribution1.id}`)
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.anything(),
                    status: expect.anything(),
                })
            );
            expect(response.body.message).toBeUndefined();
        });

        it('success as campaign admin', async () => {
            const response = await request(app)
                .get(`/contributions/${contribution1.id}`)
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignAdminToken}`]);
            expect(response.status).toEqual(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.anything(),
                    status: expect.anything(),
                })
            );
            expect(response.body.message).toBeUndefined();
        });

        it('success as campaign staff', async () => {
            const response = await request(app)
                .get(`/contributions/${contribution1.id}`)
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).toEqual(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.anything(),
                    status: expect.anything(),
                })
            );
            expect(response.body.message).toBeUndefined();
        });

        it('error permissions', async () => {
            const response = await request(app)
                .get(`/contributions/${contribution1.id}`)
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaff2Token}`]);
            expect(response.status).toEqual(422);
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: 'User does not have permissions',
                })
            );
            expect(response.body.message);
        });
    });
});
