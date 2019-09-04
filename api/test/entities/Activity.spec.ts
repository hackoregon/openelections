import { expect } from 'chai';
import { getConnection } from 'typeorm';
import {
    newActiveUserAsync,
    newCampaignAsync,
    newContributionAsync, newExpenditureAsync,
    newGovernmentAsync,
    truncateAll
} from '../factories';
import {
    Activity,
    ActivityTypeEnum,
    getActivityByCampaignAsync,
    getActivityByCampaignByTimeAsync,
    getActivityByContributionAsync,
    getActivityByExpenditureAsync,
    getActivityByGovernmentAsync,
    getActivityByUserAsync
} from '../../models/entity/Activity';
import { Government } from '../../models/entity/Government';
import { createActivityRecordAsync } from '../../services/activityService';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../../models/entity/Permission';

let activityRepository: any;
let government: Government;

describe('Activity', () => {
    before(() => {
        activityRepository = getConnection('default').getRepository('Activity');
    });

    beforeEach(async () => {
        government = await newGovernmentAsync();
    });

    afterEach(async () => {
        await truncateAll();
    });

    describe('validations', () => {
        it('notes', async () => {
            const activity = new Activity();
            expect(await activity.isValidAsync()).to.be.false;
            expect(activity.errors[0].property).to.equal('notes');
            expect(activity.errors[0].constraints.isDefined).to.equal('notes should not be null or undefined');
        });

        it('activityId', async () => {
            const activity = new Activity();
            activity.notes = 'Dan Melton updates something';
            expect(await activity.isValidAsync()).to.be.false;
            expect(activity.errors[0].property).to.equal('activityId');
            expect(activity.errors[0].constraints.isDefined).to.equal('activityId should not be null or undefined');
        });

        it('activityType', async () => {
            const activity = new Activity();
            activity.notes = 'Dan Melton updates something';
            activity.activityId = 1;
            expect(await activity.isValidAsync()).to.be.false;
            expect(activity.errors[0].property).to.equal('activityType');
            expect(activity.errors[0].constraints.isDefined).to.equal('activityType should not be null or undefined');
        });

        it('valid', async () => {
            const activity = new Activity();
            activity.notes = 'Dan Melton updates something';
            activity.activityId = 1;
            activity.activityType = ActivityTypeEnum.GOVERNMENT;
            activity.government = government;
            expect(await activity.isValidAsync()).to.be.true;
            expect(await activityRepository.count()).to.equal(0);
            expect(activity.createdAt).to.be.undefined;
            await activityRepository.save(activity);
            expect(await activityRepository.count()).to.equal(1);
            expect(activity.createdAt).to.not.be.undefined;
        });
    });

    it('getActivityByGovernmentAsync', async () => {
        const user = await newActiveUserAsync();
        const campaign = await newCampaignAsync();
        const activity1 = await createActivityRecordAsync({
            government,
            currentUser: user,
            campaign,
            notes: `Something happened 1`,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: user.id,
        });
        const activity2 = await createActivityRecordAsync({
            government,
            currentUser: user,
            campaign,
            notes: `Something happened 2`,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: user.id,
        });
        // test pagination
        const noRecords = await getActivityByGovernmentAsync(1000, 100, 0);
        const records1 = await getActivityByGovernmentAsync(government.id, 100, 0);
        const records2 = await getActivityByGovernmentAsync(government.id, 1, 0);
        const records3 = await getActivityByGovernmentAsync(government.id, 1, 1);
        expect(noRecords.length).to.equal(0);
        expect(records1.length).to.equal(2);
        expect(records2.length).to.equal(1);
        expect(records2[0].id).to.equal(activity2.id);
        expect(records3.length).to.equal(1);
        expect(records3[0].id).to.equal(activity1.id);
    });

    it('getActivityByCampaignAsync', async () => {
        const user = await newActiveUserAsync();
        const campaign = await newCampaignAsync();
        const campaign2 = await newCampaignAsync();
        const activity1 = await createActivityRecordAsync({
            government,
            currentUser: user,
            campaign,
            notes: `Something happened 1`,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: user.id,
        });
        const activity2 = await createActivityRecordAsync({
            government,
            currentUser: user,
            campaign,
            notes: `Something happened 2`,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: user.id,
        });

        await createActivityRecordAsync({
            government,
            currentUser: user,
            campaign: campaign2,
            notes: `Something happened 3`,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: user.id,
        });
        // test pagination
        expect(await activityRepository.count()).to.equal(3);
        const noRecords = await getActivityByCampaignAsync(1000, 100, 0);
        const records1 = await getActivityByCampaignAsync(campaign.id, 100, 0);
        const records2 = await getActivityByCampaignAsync(campaign.id, 1, 0);
        const records3 = await getActivityByCampaignAsync(campaign.id, 1, 1);
        expect(noRecords.length).to.equal(0);
        expect(records1.length).to.equal(2);
        expect(records2.length).to.equal(1);
        expect(records2[0].id).to.equal(activity2.id);
        expect(records3.length).to.equal(1);
        expect(records3[0].id).to.equal(activity1.id);
    });

    it('getActivityByUser', async () => {
        const user = await newActiveUserAsync();
        const govUser = await newActiveUserAsync();
        const gov = await newGovernmentAsync();
        const campaign = await newCampaignAsync(gov);
        await addPermissionAsync({userId: govUser.id, role: UserRole.GOVERNMENT_ADMIN, governmentId: gov.id});
        const permission = await addPermissionAsync({userId: user.id, role: UserRole.CAMPAIGN_ADMIN, campaignId: campaign.id});
        await createActivityRecordAsync({
            currentUser: user,
            notes: `${govUser.name()} added ${user.name()} to ${gov.name} as a ${UserRole.CAMPAIGN_ADMIN}`,
            government: gov,
            campaign,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: permission.id
        });
        const activities = await getActivityByUserAsync(user.id, 100, 0);
        expect(activities.length).to.equal(1);
    });

    it('getActivityByContributionAsync', async () => {
        const gov = await newGovernmentAsync();
        const campaign = await newCampaignAsync(gov);
        const contr = await newContributionAsync(campaign, gov);
        const user = await newActiveUserAsync();
        const permission = await addPermissionAsync({userId: user.id, role: UserRole.CAMPAIGN_ADMIN, campaignId: campaign.id});
        await createActivityRecordAsync({
            currentUser: user,
            notes: `${user.name()} added a new contribution (${contr.id})`,
            campaign,
            government: gov,
            activityType: ActivityTypeEnum.CONTRIBUTION,
            activityId: contr.id
        });

        await createActivityRecordAsync({
            currentUser: user,
            notes: `Note from ${user.name()}: There is a problem with this contribution, please resubmit.`,
            campaign,
            government: gov,
            activityType: ActivityTypeEnum.COMMENT_CONTR,
            activityId: contr.id
        });
        const activities = await getActivityByContributionAsync(contr.id, 100, 0);
        expect(activities.length).to.equal(2);
    });

    it('getActivityByExpenditureAsync', async () => {
        const gov = await newGovernmentAsync();
        const campaign = await newCampaignAsync(gov);
        const exp = await newExpenditureAsync(campaign, gov);
        const user = await newActiveUserAsync();
        const permission = await addPermissionAsync({userId: user.id, role: UserRole.CAMPAIGN_ADMIN, campaignId: campaign.id});
        await createActivityRecordAsync({
            currentUser: user,
            notes: `${user.name()} added a new expenditure (${exp.id})`,
            campaign,
            government: gov,
            activityType: ActivityTypeEnum.EXPENDITURE,
            activityId: exp.id
        });
        await createActivityRecordAsync({
            currentUser: user,
            notes: `Note from ${user.name()}: There is a problem with this expenditure (${exp.id})`,
            campaign,
            government: gov,
            activityType: ActivityTypeEnum.COMMENT_EXP,
            activityId: exp.id
        });
        const activities = await getActivityByExpenditureAsync(exp.id, 100, 0);
        expect(activities.length).to.equal(2);
    });

    it('getActivityByCampaignByTimeAsync testme', async () => {
        const gov = await newGovernmentAsync();
        const campaign = await newCampaignAsync(gov);
        const contr = await newContributionAsync(campaign, gov);
        const user = await newActiveUserAsync();
        await addPermissionAsync({userId: user.id, role: UserRole.CAMPAIGN_ADMIN, campaignId: campaign.id});
        const activity1 = await createActivityRecordAsync({
            currentUser: user,
            notes: `${user.name()} added a new contribution (${contr.id})`,
            campaign,
            government: gov,
            activityType: ActivityTypeEnum.CONTRIBUTION,
            activityId: contr.id
        });

        const activity2 = await createActivityRecordAsync({
            currentUser: user,
            notes: `Note from ${user.name()}: There is a problem with this contribution, please resubmit.`,
            campaign,
            government: gov,
            activityType: ActivityTypeEnum.COMMENT_CONTR,
            activityId: contr.id
        });

        activityRepository.update(activity1.id, {createdAt: new Date(2019, 1, 1)});
        activityRepository.update(activity2.id, {createdAt: new Date(2019, 8, 1)});
        const activities = await getActivityByContributionAsync(contr.id, 100, 0);
        expect(activities.length).to.equal(2);
        let from = new Date(2018, 12, 31);
        let to = new Date(2019, 1, 31);
        let activitiesTime = await getActivityByCampaignByTimeAsync(campaign.id, from, to);
        expect(activitiesTime.length).to.equal(1);
        from = new Date(2018, 12, 31);
        to = new Date(2020, 1, 31);
        activitiesTime = await getActivityByCampaignByTimeAsync(campaign.id, from, to);
        expect(activitiesTime.length).to.equal(2);

        from = new Date(2017, 12, 31);
        to = new Date(2018, 1, 31);
        activitiesTime = await getActivityByCampaignByTimeAsync(campaign.id, from, to);
        expect(activitiesTime.length).to.equal(0);
    });
});
