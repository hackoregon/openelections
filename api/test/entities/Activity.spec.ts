import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { newGovernmentAsync, truncateAll } from '../factories';
import { Activity, ActivityTypeEnum } from '../../models/entity/Activity';
import { Government } from '../../models/entity/Government';

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
});
