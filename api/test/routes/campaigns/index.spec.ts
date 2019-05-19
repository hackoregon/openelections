import * as express from 'express';
import { expect } from 'chai';
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

    context('/campaigns', () => {
        it('gets campaigns if the user is a government admin', async () => {
            const response = await request(app)
                .post('/campaigns')
                .send({
                    governmentId: government.id
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(200);
            expect(response.body)
                .to.be.an.instanceof(Array)
                .that.has.length(1)
                .and.to.have.property(0)
                .that.includes.all.keys(['id', 'name']);
        });

        it('returns an error if the user is not a government admin', async () => {
            const response = await request(app)
                .post('/campaigns')
                .send({
                    governmentId: government.id
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignAdminToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('User is not an admin for the provided government');
        });

        it('returns an error if government id is not specified', async () => {
            const response = await request(app)
                .post('/campaigns')
                .send({
                    governmentId: undefined
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('governmentId must be a number');
        });
    });
});
