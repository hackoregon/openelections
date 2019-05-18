import { expect } from 'chai';
import * as express from 'express';
import { Campaign } from '../../../models/entity/Campaign';
import { Government } from '../../../models/entity/Government';
import { User } from '../../../models/entity/User';
import { newActiveUserAsync, newCampaignAsync, newGovernmentAsync, truncateAll } from '../../factories';
import {
    createActivityRecordAsync,
} from '../../../services/activityService';
import { addPermissionAsync, generateJWTokenAsync } from '../../../services/permissionService';
import * as request from 'supertest';
import { Permission, UserRole } from '../../../models/entity/Permission';
import { ActivityTypeEnum } from '../../../models/entity/Activity';
import { getConnection } from 'typeorm';
import { setupRoutes } from '../../../routes';

let app: express.Express;
let government: Government;
let campaign1: Campaign;
let govUser: User;
let campaignAdmin: User;
let campaignStaff: User;
let permission: Permission;
let activityRepository: any;
let govUserToken: string;
let campaignAdminToken: string;
let campaignStaffToken: string;

describe('Activity', () => {

    before(async () => {
        app = express();
        setupRoutes(app);
    });

    beforeEach(async () => {
        govUser = await newActiveUserAsync();
        campaignAdmin = await newActiveUserAsync();
        campaignStaff = await newActiveUserAsync();
        government = await newGovernmentAsync();
        campaign1 = await newCampaignAsync();
        permission = await addPermissionAsync({
            userId: govUser.id,
            governmentId: government.id,
            role: UserRole.GOVERNMENT_ADMIN
        });
        await addPermissionAsync({
            userId: campaignAdmin.id,
            governmentId: government.id,
            campaignId: campaign1.id,
            role: UserRole.CAMPAIGN_ADMIN
        });
        await addPermissionAsync({
            userId: campaignStaff.id,
            governmentId: government.id,
            campaignId: campaign1.id,
            role: UserRole.CAMPAIGN_STAFF
        });
        await createActivityRecordAsync({
            government,
            currentUser: govUser,
            campaign: campaign1,
            notes: `Something happened 1`,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: govUser.id,
        });

        await createActivityRecordAsync({
            government,
            currentUser: govUser,
            campaign: campaign1,
            notes: `Something happened 2`,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: govUser.id,
        });
        activityRepository = getConnection('default').getRepository('Activity');
        govUserToken = await generateJWTokenAsync(govUser.id);
        campaignStaffToken = await generateJWTokenAsync(campaignStaff.id);
        campaignAdminToken = await generateJWTokenAsync(campaignAdmin.id);
    });

    afterEach(async () => {
        await truncateAll();
    });

    it('post /activities success governmentAdmin', async () => {
        const response = await request(app)
            .post('/activities')
            .send({
                governmentId: government.id,
            })
            .set('Accept', 'application/json')
            .set('Cookie', [`token=${govUserToken}`]);
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(2);
    });

    it('post /activities success governmentAdmin pagination', async () => {
        const response = await request(app)
            .post('/activities')
            .send({
                governmentId: government.id,
                perPage: 1,
                page: 0
            })
            .set('Accept', 'application/json')
            .set('Cookie', [`token=${govUserToken}`]);
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
    });

    it('post /activities success campaignAdmin', async () => {
        const response = await request(app)
            .post('/activities')
            .send({
                governmentId: government.id,
                campaignId: campaign1.id,
                perPage: 1,
                page: 0
            })
            .set('Accept', 'application/json')
            .set('Cookie', [`token=${campaignAdminToken}`]);
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
    });

    it('post /activities success campaignStaff', async () => {
        const response = await request(app)
            .post('/activities')
            .send({
                governmentId: government.id,
                campaignId: campaign1.id,
                perPage: 1,
                page: 0
            })
            .set('Accept', 'application/json')
            .set('Cookie', [`token=${campaignStaffToken}`]);
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
    });

    it('post /activities fails bad token', async () => {
        const response = await request(app)
            .post('/activities')
            .send({
                governmentId: government.id,
                campaignId: campaign1.id,
                perPage: 1,
                page: 0
            })
            .set('Accept', 'application/json')
            .set('Cookie', [`token=${1111}`]);
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Token expired or incorrect');
    });

});
