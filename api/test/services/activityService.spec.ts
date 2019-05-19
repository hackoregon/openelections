import { expect } from 'chai';
import { Campaign } from '../../models/entity/Campaign';
import { Government } from '../../models/entity/Government';
import { User } from '../../models/entity/User';
import { newActiveUserAsync, newCampaignAsync, newGovernmentAsync, truncateAll } from '../factories';
import {
    createActivityRecordAsync,
    getAllActivityRecordsforGovernmentOrCampaignAsync
} from '../../services/activityService';
import { addPermissionAsync } from '../../services/permissionService';
import { Permission, UserRole } from '../../models/entity/Permission';
import { ActivityTypeEnum } from '../../models/entity/Activity';
import { getConnection } from 'typeorm';

let government: Government;
let campaign1: Campaign;
let campaign2: Campaign;
let govUser: User;
let campaignAdmin: User;
let campaignStaff: User;
let permission: Permission;
let activityRepository: any;

describe('Activity', () => {
    beforeEach(async () => {
        govUser = await newActiveUserAsync();
        campaignAdmin = await newActiveUserAsync();
        campaignStaff = await newActiveUserAsync();
        government = await newGovernmentAsync();
        campaign1 = await newCampaignAsync();
        campaign2 = await newCampaignAsync();
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
            campaignId: campaign2.id,
            role: UserRole.CAMPAIGN_STAFF
        });
        activityRepository = getConnection('default').getRepository('Activity');
    });

    afterEach(async () => {
        await truncateAll();
    });


    it('createActivityRecordAsync', async () => {
        expect(await activityRepository.count()).to.equal(0);
        await createActivityRecordAsync({
            currentUser: govUser,
            government: government,
            notes: `${govUser.name} invited to ${government.name} as ${permission.role}`,
            activityId: permission.id,
            activityType: ActivityTypeEnum.PERMISSION
        });
        expect(await activityRepository.count()).to.equal(1);
    });

    describe('getAllActivityRecordsforGovernmentOrCampaignAsync', () => {
        beforeEach(async () => {
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
                campaign: campaign2,
                notes: `Something happened 2`,
                activityType: ActivityTypeEnum.PERMISSION,
                activityId: govUser.id,
            });
        });

        it('[] for campaignAdmin trying to get governmentId', async () => {
            const records = await getAllActivityRecordsforGovernmentOrCampaignAsync({
                currentUserId: campaignAdmin.id,
                governmentId: government.id
            });
            expect(records.length).to.equal(0);
        });

        it('[] for campaignStaff trying to get governmentId', async () => {
            const records = await getAllActivityRecordsforGovernmentOrCampaignAsync({
                currentUserId: campaignStaff.id,
                governmentId: government.id
            });
            expect(records.length).to.equal(0);
        });

        it('2 records for governmentAdmin trying to get governmentId', async () => {
            const records = await getAllActivityRecordsforGovernmentOrCampaignAsync({
                currentUserId: govUser.id,
                governmentId: government.id
            });
            expect(records.length).to.equal(2);
        });

        it('1 records for governmentAdmin with campaignId', async () => {
            let records = await getAllActivityRecordsforGovernmentOrCampaignAsync({
                currentUserId: govUser.id,
                governmentId: government.id,
                campaignId: campaign1.id
            });
            expect(records.length).to.equal(1);

            records = await getAllActivityRecordsforGovernmentOrCampaignAsync({
                currentUserId: govUser.id,
                governmentId: government.id,
                campaignId: campaign2.id
            });
            expect(records.length).to.equal(1);
        });

        it('1 records for campaignAdmin with campaignId', async () => {
            const records = await getAllActivityRecordsforGovernmentOrCampaignAsync({
                currentUserId: campaignAdmin.id,
                governmentId: government.id,
                campaignId: campaign1.id
            });
            expect(records.length).to.equal(1);
        });


        it('1 records for campaignStaff with campaignId', async () => {
            const records = await getAllActivityRecordsforGovernmentOrCampaignAsync({
                currentUserId: campaignStaff.id,
                governmentId: government.id,
                campaignId: campaign2.id
            });
            expect(records.length).to.equal(1);
        });

        it('[] records for campaignStaff with different campaignId', async () => {
            const records = await getAllActivityRecordsforGovernmentOrCampaignAsync({
                currentUserId: campaignStaff.id,
                governmentId: government.id,
                campaignId: campaign1.id
            });
            expect(records.length).to.equal(0);
        });

        it('[] records for campaignAdmin with different campaignId', async () => {
            const records = await getAllActivityRecordsforGovernmentOrCampaignAsync({
                currentUserId: campaignAdmin.id,
                governmentId: government.id,
                campaignId: campaign2.id
            });
            expect(records.length).to.equal(0);
        });
    });
});
