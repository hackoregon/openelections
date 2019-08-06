import { expect } from 'chai';
import { Campaign } from '../../models/entity/Campaign';
import { Government } from '../../models/entity/Government';
import { User } from '../../models/entity/User';
import {
    newActiveUserAsync,
    newCampaignAsync,
    newContributionAsync, newExpenditureAsync,
    newGovernmentAsync,
    truncateAll
} from '../factories';
import {
    createActivityRecordAsync, getAllActivityRecordsAsync,
} from '../../services/activityService';
import { addPermissionAsync } from '../../services/permissionService';
import { Permission, UserRole } from '../../models/entity/Permission';
import { ActivityTypeEnum } from '../../models/entity/Activity';
import { getConnection } from 'typeorm';
import { Contribution } from '../../models/entity/Contribution';
import { Expenditure } from '../../models/entity/Expenditure';

let government: Government;
let campaign1: Campaign;
let campaign2: Campaign;
let govUser: User;
let campaignAdmin: User;
let campaignStaff: User;
let permission: Permission;
let activityRepository: any;
let contribution1: Contribution;
let contribution2: Contribution;
let expenditure1: Expenditure;
let expenditure2: Expenditure;

describe('Activity', () => {
    beforeEach(async () => {
        govUser = await newActiveUserAsync();
        campaignAdmin = await newActiveUserAsync();
        campaignStaff = await newActiveUserAsync();
        government = await newGovernmentAsync();
        campaign1 = await newCampaignAsync(government);
        campaign2 = await newCampaignAsync(government);
        contribution1 = await newContributionAsync(campaign1, government);
        contribution2 = await newContributionAsync(campaign2, government);
        expenditure1 = await newExpenditureAsync(campaign1, government);
        expenditure2 = await newExpenditureAsync(campaign2, government);
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
        activityRepository = getConnection('default').getRepository('Activity');
    });

    afterEach(async () => {
        await truncateAll();
    });


    it('createActivityRecordAsync Permission', async () => {
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

    it('createActivityRecordAsync Contribution', async () => {
        expect(await activityRepository.count()).to.equal(0);
        await createActivityRecordAsync({
            currentUser: campaignAdmin,
            government: government,
            notes: `something happened`,
            activityId: contribution1.id,
            activityType: ActivityTypeEnum.CONTRIBUTION
        });
        expect(await activityRepository.count()).to.equal(1);
    });

    it('createActivityRecordAsync Contribution', async () => {
        expect(await activityRepository.count()).to.equal(0);
        await createActivityRecordAsync({
            currentUser: campaignAdmin,
            government: government,
            notes: 'this is a comment',
            activityId: contribution1.id,
            activityType: ActivityTypeEnum.COMMENT_CONTR
        });
        expect(await activityRepository.count()).to.equal(1);
    });

    it('createActivityRecordAsync Expenditure', async () => {
        expect(await activityRepository.count()).to.equal(0);
        await createActivityRecordAsync({
            currentUser: campaignAdmin,
            government: government,
            notes: `something happened`,
            activityId: expenditure1.id,
            activityType: ActivityTypeEnum.EXPENDITURE
        });
        expect(await activityRepository.count()).to.equal(1);
    });

    it('createActivityRecordAsync Expenditure', async () => {
        expect(await activityRepository.count()).to.equal(0);
        await createActivityRecordAsync({
            currentUser: campaignAdmin,
            government: government,
            notes: 'this is a comment',
            activityId: expenditure1.id,
            activityType: ActivityTypeEnum.COMMENT_EXP
        });
        expect(await activityRepository.count()).to.equal(1);
    });

    describe('getAllActivityRecordsAsync', () => {
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

            await createActivityRecordAsync({
                government,
                currentUser: govUser,
                campaign: campaign1,
                notes: `Something happened 1`,
                activityType: ActivityTypeEnum.CONTRIBUTION,
                activityId: contribution1.id,
            });
            await createActivityRecordAsync({
                government,
                currentUser: govUser,
                campaign: campaign2,
                notes: `Something happened`,
                activityType: ActivityTypeEnum.CONTRIBUTION,
                activityId: contribution2.id,
            });

            await createActivityRecordAsync({
                government,
                currentUser: govUser,
                campaign: campaign1,
                notes: `Something happened 1`,
                activityType: ActivityTypeEnum.EXPENDITURE,
                activityId: expenditure1.id,
            });
            await createActivityRecordAsync({
                government,
                currentUser: govUser,
                campaign: campaign2,
                notes: `Something happened`,
                activityType: ActivityTypeEnum.EXPENDITURE,
                activityId: expenditure2.id,
            });
        });

        it('[] for campaignAdmin trying to get governmentId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignAdmin.id,
                governmentId: government.id
            });
            expect(records.length).to.equal(0);
        });

        it('[] for campaignStaff trying to get governmentId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignStaff.id,
                governmentId: government.id
            });
            expect(records.length).to.equal(0);
        });

        it('6 records for governmentAdmin trying to get governmentId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: govUser.id,
                governmentId: government.id
            });
            expect(records.length).to.equal(6);
        });

        it('3 records for governmentAdmin with campaignId', async () => {
            let records = await getAllActivityRecordsAsync({
                currentUserId: govUser.id,
                campaignId: campaign1.id
            });
            expect(records.length).to.equal(3);

            records = await getAllActivityRecordsAsync({
                currentUserId: govUser.id,
                campaignId: campaign2.id
            });
            expect(records.length).to.equal(3);
        });

        it('3 records for campaignAdmin with campaignId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignAdmin.id,
                campaignId: campaign1.id
            });
            expect(records.length).to.equal(3);
        });


        it('3 records for campaignStaff with campaignId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignStaff.id,
                campaignId: campaign1.id
            });
            expect(records.length).to.equal(3);
        });

        it('[] records for campaignStaff with different campaignId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignStaff.id,
                campaignId: campaign2.id
            });
            expect(records.length).to.equal(0);
        });

        it('[] records for campaignAdmin with different campaignId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignAdmin.id,
                campaignId: campaign2.id
            });
            expect(records.length).to.equal(0);
        });

        it('1 records for governmentAdmin with contributionId', async () => {
            let records = await getAllActivityRecordsAsync({
                currentUserId: govUser.id,
                contributionId: contribution1.id
            });
            expect(records.length).to.equal(1);

            records = await getAllActivityRecordsAsync({
                currentUserId: govUser.id,
                contributionId: contribution2.id
            });
            expect(records.length).to.equal(1);
        });

        it('1 records for campaignAdmin with contributionId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignAdmin.id,
                contributionId: contribution1.id
            });
            expect(records.length).to.equal(1);
        });


        it('1 records for campaignStaff with contributionId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignStaff.id,
                contributionId: contribution1.id
            });
            expect(records.length).to.equal(1);
        });

        it('[] records for campaignStaff with different contributionId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignStaff.id,
                contributionId: contribution2.id
            });
            expect(records.length).to.equal(0);
        });

        it('[] records for campaignAdmin with different contributionId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignAdmin.id,
                contributionId: contribution2.id
            });
            expect(records.length).to.equal(0);
        });

        it('1 records for governmentAdmin with expenditureId', async () => {
            let records = await getAllActivityRecordsAsync({
                currentUserId: govUser.id,
                expenditureId: expenditure1.id
            });
            expect(records.length).to.equal(1);

            records = await getAllActivityRecordsAsync({
                currentUserId: govUser.id,
                expenditureId: expenditure2.id
            });
            expect(records.length).to.equal(1);
        });

        it('1 records for campaignAdmin with expenditureId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignAdmin.id,
                expenditureId: expenditure1.id
            });
            expect(records.length).to.equal(1);
        });


        it('1 records for campaignStaff with expenditureId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignStaff.id,
                expenditureId: expenditure1.id
            });
            expect(records.length).to.equal(1);
        });

        it('[] records for campaignStaff with different expenditureId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignStaff.id,
                expenditureId: expenditure2.id
            });
            expect(records.length).to.equal(0);
        });

        it('[] records for campaignAdmin with different expenditureId', async () => {
            const records = await getAllActivityRecordsAsync({
                currentUserId: campaignAdmin.id,
                expenditureId: expenditure2.id
            });
            expect(records.length).to.equal(0);
        });


    });
});
