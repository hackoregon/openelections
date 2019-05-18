import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn
} from 'typeorm';
import { Government, IGovernmentSummary } from './Government';
import { Campaign, ICampaignSummary } from './Campaign';
import { IUserSummary, User } from './User';
import { IsDefined, validate, ValidationError } from 'class-validator';

export enum ActivityTypeEnum {
    USER = 'user',
    PERMISSION = 'permission',
    CAMPAIGN = 'campaign',
    GOVERNMENT = 'government'
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
        await this.validateGovernmentAsync();
    }

    async validateGovernmentAsync() {
        const g = await this.government;
        if (!g) {
            const error = new ValidationError();
            error.property = 'governmentId';
            error.constraints = {isDefined: 'governmentId should not be null or undefined'};
            this.errors.push(error);
        }
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

export interface IActivity {
    id: number;
    user: {
        id: number;
        firstName: string;
        lastName: string;
    };
    government: {
        id: number;
        name: string;
    };
    campaign: {
        id: number;
        name: string;
    };
    notes: string;
    record: ICampaignSummary | IGovernmentSummary | IUserSummary;
}
