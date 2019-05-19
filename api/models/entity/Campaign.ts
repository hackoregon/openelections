import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
    getConnection
} from 'typeorm';
import { Government } from './Government';
import { Permission } from './Permission';
import { IsDefined, validate, ValidationError } from 'class-validator';
import { Activity } from './Activity';

@Entity()
export class Campaign {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsDefined()
    name: string;

    @ManyToOne(type => Government, government => government.campaigns, {
        eager: true
    })
    government: Government;

    @OneToMany(type => Activity, activity => activity.user)
    activities: Activity[];

    @OneToMany(type => Permission, permission => permission.campaign)
    permissions: Permission[];

    public errors: ValidationError[];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await this.validateAsync();
        if (this.errors.length > 0) {
            throw new Error('campaign has one or more validation problems');
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
            error.constraints = { isDefined: 'governmentId should not be null or undefined' };
            this.errors.push(error);
        }
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            governmentId: this.government.id
        };
    }
}

export interface ICampaignSummary {
    id: number;
    name: string;
}

export async function getCampaignSummariesByGovernmentIdAsync(governmentId: number): Promise<ICampaignSummary[]> {
    const campaignRepository = getConnection('default').getRepository('Campaign');
    const campaigns = (await campaignRepository
        .createQueryBuilder('campaign')
        .andWhere('"campaign"."governmentId" = :governmentId', { governmentId })
        .select(['campaign.id', 'campaign.name'])
        .getMany()) as ICampaignSummary[];
    return campaigns;
}
