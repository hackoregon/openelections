import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    getConnection,
    Between
} from 'typeorm';
import {Government} from './Government';
import {Campaign} from './Campaign';
import {User} from './User';
import {IsDefined, validate, ValidationError} from 'class-validator';
import {Contribution} from './Contribution';
import {Expenditure} from './Expenditure';

export enum ActivityTypeEnum {
    USER = 'user',
    PERMISSION = 'permission',
    CAMPAIGN = 'campaign',
    GOVERNMENT = 'government',
    INVITATION_EMAIL = 'invitation email',
    CONTRIBUTION = 'contribution',
    EXPENDITURE = 'expenditure',
    COMMENT_CONTR = 'commentcontr',
    COMMENT_EXP = 'commentexp',
}

// Note, if you change any column type on the model, it will do a drop column operation, which means data loss in production.
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

    @Column({
        nullable: true,
        default: false
    })
    notify: boolean;

    @Column({
        nullable: true,
    })
    attachmentPath: string;

    @ManyToOne(type => Government, government => government.activities, {eager: true})
    government: Government;

    @ManyToOne(type => Campaign, campaign => campaign.activities, {eager: true})
    campaign: Campaign;

    @ManyToOne(type => User, user => user.activities, {eager: true})
    user: User;

    @ManyToOne(type => Contribution, contribution => contribution.activities, {eager: true})
    contribution: Contribution;

    @ManyToOne(type => Expenditure, expenditure => expenditure.activities, {eager: true})
    expenditure: Expenditure;

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

export interface IActivityResults {
    data: IActivityResult[]
    perPage: number;
    page: number;
    total: number;
}

export interface IActivityResult {
    id: number;
    userId: number;
    notes: string;
    activityId: number;
    activityType: ActivityTypeEnum;
    campaignId?: number;
}

export async function getActivityByGovernmentAsync(governmentId, perPage, page: number): Promise<IActivityResults> {
    const activityRepository = getConnection('default').getRepository('Activity');
    const total = await activityRepository
        .createQueryBuilder('activity')
        .select(
            'activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"'
        )
        .andWhere('"activity"."governmentId" = :governmentId', {governmentId: governmentId})
        .getCount();
    const data = (await activityRepository
        .createQueryBuilder('activity')
        .select(
            'activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"'
        )
        .andWhere('"activity"."governmentId" = :governmentId', {governmentId: governmentId})
        .orderBy('"activity"."createdAt"', 'DESC')
        .limit(perPage)
        .offset(perPage * page)
        .getRawMany() as IActivityResult[]);
    return {
        data,
        total,
        perPage,
        page
    };
}

export async function getActivityByCampaignAsync(campaignId, perPage, page: number): Promise<IActivityResults> {
    const activityRepository = getConnection('default').getRepository('Activity');
    const total = await activityRepository
        .createQueryBuilder('activity')
        .select(
            'activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"'
        )
        .andWhere('"activity"."campaignId" = :campaignId', {campaignId})
        .getCount();
    const data = (await activityRepository
        .createQueryBuilder('activity')
        .select(
            'activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"'
        )
        .andWhere('"activity"."campaignId" = :campaignId', {campaignId})
        .orderBy('"activity"."createdAt"', 'DESC')
        .limit(perPage)
        .offset(perPage * page)
        .getRawMany()) as IActivityResult[];

    return {
        data,
        total,
        perPage,
        page
    };
}


export interface IShortActivityResult {
    notes: string;
    activityId: number;
    activityType: ActivityTypeEnum;
}

export async function getActivityByCampaignByTimeAsync(campaignId: number, from, to: Date): Promise<IShortActivityResult[]> {
    const activityRepository = getConnection('default').getRepository('Activity');
    return (await activityRepository
        .find({
            select: ['notes', 'activityId', 'activityType', 'createdAt'],
            where: {
                campaign: {
                    id: campaignId
                },
                createdAt: Between(from, to),
                notify: true,
            },
            order: {
                createdAt: 'DESC'
            }
        })) as IShortActivityResult[];
}

export async function getActivityByUserAsync(userId, perPage, page: number): Promise<IActivityResults> {
    const activityRepository = getConnection('default').getRepository('Activity');
    const total = await activityRepository.createQueryBuilder('activity')
        .select('activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"')
        .andWhere('"activity"."userId" = :userId', {userId})
        .getCount();
    const data = await activityRepository.createQueryBuilder('activity')
        .select('activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"')
        .andWhere('"activity"."userId" = :userId', {userId})
        .orderBy('"activity"."createdAt"', 'DESC')
        .limit(perPage)
        .offset(perPage * page)
        .getRawMany() as IActivityResult[];
    return {
        data,
        total,
        perPage,
        page
    };
}

export async function getActivityByContributionAsync(contributionId, perPage, page: number): Promise<IActivityResults> {
    const activityRepository = getConnection('default').getRepository('Activity');
    const total = await activityRepository.createQueryBuilder('activity')
        .select('activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"')
        .andWhere('"activity"."activityId" = :contributionId', {contributionId})
        .andWhere('("activity"."activityType" = :activityType1 OR "activity"."activityType" = :activityType2)', {
            activityType1: ActivityTypeEnum.CONTRIBUTION,
            activityType2: ActivityTypeEnum.COMMENT_CONTR
        })
        .getCount();
    const data = (await activityRepository.createQueryBuilder('activity')
        .select('activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"')
        .andWhere('"activity"."activityId" = :contributionId', {contributionId})
        .andWhere('("activity"."activityType" = :activityType1 OR "activity"."activityType" = :activityType2)', {
            activityType1: ActivityTypeEnum.CONTRIBUTION,
            activityType2: ActivityTypeEnum.COMMENT_CONTR
        })
        .orderBy('"activity"."createdAt"', 'DESC')
        .limit(perPage)
        .offset(perPage * page)
        .getRawMany()) as IActivityResult[];
    return {
        data,
        total,
        perPage,
        page
    };
}

export async function getActivityByExpenditureAsync(expenditureId, perPage, page: number): Promise<IActivityResults> {
    const activityRepository = getConnection('default').getRepository('Activity');
    const data = await activityRepository.createQueryBuilder('activity')
        .select('activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"')
        .andWhere('"activity"."activityId" = :expenditureId', {expenditureId})
        .andWhere('("activity"."activityType" = :activityType1 OR "activity"."activityType" = :activityType2)', {
            activityType1: ActivityTypeEnum.EXPENDITURE,
            activityType2: ActivityTypeEnum.COMMENT_EXP
        })
        .orderBy('"activity"."createdAt"', 'DESC')
        .limit(perPage)
        .offset(perPage * page)
        .getRawMany() as IActivityResult[];
    const total = await activityRepository.createQueryBuilder('activity')
        .select('activity.id, "activity"."userId", activity.notes, "activity"."campaignId", "activity"."activityId", "activity"."activityType", "activity"."createdAt"')
        .andWhere('"activity"."activityId" = :expenditureId', {expenditureId})
        .andWhere('("activity"."activityType" = :activityType1 OR "activity"."activityType" = :activityType2)', {
            activityType1: ActivityTypeEnum.EXPENDITURE,
            activityType2: ActivityTypeEnum.COMMENT_EXP
        })
        .getCount();
    return {
        data,
        total,
        perPage,
        page
    };
}
