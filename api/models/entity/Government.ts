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
