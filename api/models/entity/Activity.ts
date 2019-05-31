import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn, getConnection, OneToMany
} from 'typeorm';
import { Government, IGovernmentSummary } from './Government';
import { Campaign, ICampaignSummary } from './Campaign';
import { IUserSummary, User } from './User';
import { IsDefined, validate, ValidationError } from 'class-validator';
import { IUserPermission, IUserPermissionResult } from './Permission';
import { Contribution } from './Contribution';

export enum ActivityTypeEnum {
    USER = 'user',
    PERMISSION = 'permission',
    CAMPAIGN = 'campaign',
    GOVERNMENT = 'government',
    INVITATION_EMAIL = 'invitation email',
}

@Entity()
export class Activity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsDefined()
    notes: string;

    @Column()
    @IsDefined()
    activityId: number;

    @Column({
        type: 'enum',
        enum: ActivityTypeEnum
    })
    @IsDefined()
    activityType: ActivityTypeEnum;

    @ManyToOne(type => Government, government => government.activities, {eager: true})
    government: Government;

    @ManyToOne(type => Campaign, campaign => campaign.activities, {eager: true})
    campaign: Campaign;

    @ManyToOne(type => User, user => user.activities, {eager: true})
    user: User;

    @ManyToOne(type => Contribution, contribution => contribution.activities, { eager: true })
    contribution: Contribution;

    public errors: ValidationError[];

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await this.validateAsync();
        if (this.errors.length > 0) {
            throw new Error('activity has one or more validation problems');
        }
    }

    async isValidAsync(): Promise<boolean> {
        await this.validateAsync();
        return this.errors.length === 0;
    }

    async validateAsync() {
        const errors = await validate(this);
        this.errors = errors;
    }

    async validateUserAsync() {
        const u = await this.user;
        if (!u) {
            const error = new ValidationError();
            error.property = 'userId';
            error.constraints = {isDefined: 'userId should not be null or undefined'};
            this.errors.push(error);
        }
    }
}

export interface IActivityResult {
    id: number;
    userId: number;
    notes: string;
    activityId: number;
    activityType: ActivityTypeEnum;
    campaignId?: number;
}

export async function getActivityByGovernmentAsync(governmentId, perPage, page: number): Promise<IActivityResult[]> {
    const activityRepository = getConnection('default').getRepository('Activity');
    return await activityRepository.createQueryBuilder('activity')
        .select('activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType"')
        .andWhere('"activity"."governmentId" = :governmentId', {governmentId: governmentId})
        .orderBy('"activity"."createdAt"', 'DESC')
        .limit(perPage)
        .offset(perPage * page)
        .getRawMany() as IActivityResult[];
}

export async function getActivityByCampaignAsync(campaignId, perPage, page: number): Promise<IActivityResult[]> {
    const activityRepository = getConnection('default').getRepository('Activity');
    return await activityRepository.createQueryBuilder('activity')
        .select('activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType"')
        .andWhere('"activity"."campaignId" = :campaignId', {campaignId})
        .orderBy('"activity"."createdAt"', 'DESC')
        .limit(perPage)
        .offset(perPage * page)
        .getRawMany() as IActivityResult[];
}
