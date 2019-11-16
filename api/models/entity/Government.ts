import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import { Campaign } from './Campaign';
import { Permission } from './Permission';
import { IsDefined, validate, ValidationError } from 'class-validator';
import { Activity } from './Activity';
import { Contribution } from './Contribution';
import { Expenditure } from './Expenditure';

// Note, if you change any column type on the model, it will do a drop column operation, which means data loss in production.
@Entity()
export class Government {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsDefined()
    name: string;

    @OneToMany(type => Campaign, campaign => campaign.government)
    campaigns: Campaign[];

    @OneToMany(type => Permission, permission => permission.government )
    permissions: Permission[];

    @OneToMany(type => Activity, activity => activity.government)
    activities: Activity[];

    @OneToMany(type => Contribution, contribution => contribution.government)
    contributions: Contribution[];

    @OneToMany(type => Expenditure, expenditure => expenditure.government)
    expenditures: Expenditure[];

    public errors: ValidationError[];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await this.validateAsync();
        if (this.errors.length > 0) {
            throw new Error('government has one or more validation problems');
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

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }
}

export interface IGovernmentSummary {
    id: number;
    name: string;
}
