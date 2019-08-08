import * as express from 'express';
import { expect } from 'chai';
import * as faker from 'faker';
import * as request from 'supertest';
import { setupRoutes } from '../../../routes';
import { User } from '../../../models/entity/User';
import {
    newActiveUserAsync,
    newCampaignAsync,
    newContributionAsync,
    newGovernmentAsync,
    truncateAll
} from '../../factories';
import { Government } from '../../../models/entity/Government';
import { Campaign } from '../../../models/entity/Campaign';
import { addPermissionAsync, generateJWTokenAsync } from '../../../services/permissionService';
import { UserRole } from '../../../models/entity/Permission';
import { Contribution } from '../../../models/entity/Contribution';

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

describe('Routes put /contributions/:id', () => {
    before(async () => {
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
        campaignStaff2Token = await generateJWTokenAsync(campaignStaff2.id);

        contribution1 = await newContributionAsync(campaign, government);
    });

    afterEach(async () => {
        await truncateAll();
    });

    context('post /contributions/:id/comments', () => {
        it('success testme', async () => {
            const response = await request(app)
                .post(`/contributions/${contribution1.id}/comments`)
                .send({
                    comment: 'Hi!'
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).to.equal(204);
            expect(response.body.message).to.be.undefined;
        });

        it('error id not found', async () => {
            const response = await request(app)
                .post(`/contributions/11111/comments`)
                .send({
                    comment: 'Hi!'
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaffToken}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('Could not find any entity of type "Contribution" matching: 11111');
        });

        it('error user does not have permissions', async () => {
            const response = await request(app)
                .post(`/contributions/${contribution1.id}/comments`)
                .send({
                    comment: 'Hi!'
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${campaignStaff2Token}`]);
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal('User does not have permissions')
        });

    });
});
