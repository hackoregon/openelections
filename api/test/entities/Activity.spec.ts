import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { newActiveUserAsync, newCampaignAsync, newGovernmentAsync, truncateAll } from '../factories';
import {
    Activity,
    ActivityTypeEnum,
    getActivityByCampaignAsync,
    getActivityByGovernmentAsync
} from '../../models/entity/Activity';
import { Government } from '../../models/entity/Government';
import { createActivityRecordAsync } from '../../services/activityService';

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

        it('governmentId', async () => {
            const activity = new Activity();
            activity.notes = 'Dan Melton updates something';
            activity.activityId = 1;
            activity.activityType = ActivityTypeEnum.GOVERNMENT;
            expect(await activity.isValidAsync()).to.be.false;
            expect(activity.errors[0].property).to.equal('governmentId');
            expect(activity.errors[0].constraints.isDefined).to.equal('governmentId should not be null or undefined');
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

    it('getActivityByCampaignAsync testme', async () => {
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
});
