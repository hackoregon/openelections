import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate, getConnection} from 'typeorm';
import {Government, IGovernmentSummary} from './Government';
import {Campaign, ICampaignSummary} from './Campaign';
import {IUserSummary, User, UserStatus} from './User';
import {IsDefined, validate, ValidationError} from 'class-validator';

export enum UserRole {
    GOVERNMENT_ADMIN = 'government_admin',
    CAMPAIGN_ADMIN = 'campaign_admin',
    CAMPAIGN_STAFF = 'campaign_staff',
}

// Permission table connects users to campaigns and governments
@Entity()
export class Permission {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CAMPAIGN_STAFF
    })
    @IsDefined()
    role: UserRole;


    @ManyToOne(type => Government, government => government.permissions, {
        eager: true
    })
    government: Government;

    @ManyToOne(type => Campaign, campaign => campaign.permissions, {
        eager: true
    })
    campaign: Campaign;

    @ManyToOne(type => User, user => user.permissions, {
        eager: true
    })
    user: User;

    public errors: ValidationError[];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await this.validateAsync();
        if (this.errors.length > 0) {
            throw new Error('permission has one or more validation problems');
        }
    }

    async isValidAsync(): Promise<boolean> {
        await this.validateAsync();
        return this.errors.length === 0;
    }

    async validateAsync(): Promise<ValidationError[]> {
        const errors = await validate(this);
        this.errors = errors;
        await this.validateUserAsync();
        await this.validateCampaignAsync();
        await this.validateGovernmentAsync();
        return this.errors;
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

    async validateGovernmentAsync() {
        const g = await this.government;
        if (!g) {
            const error = new ValidationError();
            error.property = 'governmentId';
            error.constraints = {isDefined: 'governmentId should not be null or undefined'};
            this.errors.push(error);
        }
    }

    async validateCampaignAsync() {
        const c = await this.campaign;
        if (!c && this.role !== UserRole.GOVERNMENT_ADMIN) {
            const error = new ValidationError();
            error.property = 'campaignId';
            error.constraints = {isDefined: 'campaignId should not be null or undefined'};
            this.errors.push(error);
        } else if (c && this.role === UserRole.GOVERNMENT_ADMIN) {
            const error = new ValidationError();
            error.property = 'campaignId';
            error.constraints = {notAllowed: 'campaignId cannot be set with GovernmentAdmin as a UserRole'};
            this.errors.push(error);
        }
    }

    toJSON() {
        return {
            id: this.id,
            user: this.user.id,
            role: this.role,
            campaign: {id: this.campaign.id, name: this.campaign.name},
            government: {id: this.government.id, name: this.government.name},
        };
    }
}

export interface IUserPermissionResult {
    id: number;
    role: UserRole;
    user: User;
    government: Government;
    campaign: Campaign;
}

export interface IUserPermission {
    id: number;
    role: UserRole;
    user: IUserSummary;
    government: IGovernmentSummary;
    campaign?: ICampaignSummary;
}

export async function getPermissionsByCampaignIdAsync(campaignId: number): Promise<IUserPermission[]> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permissions = await permissionRepository.createQueryBuilder('permission')
        .andWhere('"permission"."campaignId" = :campaignId', {campaignId}) // notice "" quotes around camelCase id items
        .innerJoinAndSelect('permission.user', 'user',)
        .innerJoinAndSelect('permission.campaign', 'campaign')
        .innerJoinAndSelect('permission.government', 'government')
        .getMany() as IUserPermissionResult[];
    return permissions.map(permission => {
        return {
            id: permission.id,
            role: permission.role,
            user: permission.user.toJSON(),
            campaign: {
                id: permission.campaign.id,
                name: permission.campaign.name,
            },
            government: {
                id: permission.government.id,
                name: permission.government.name,
            },
        };
    });
}

export async function getPermissionsByGovernmentIdAsync(governmentId: number): Promise<IUserPermission[]> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permissions = await permissionRepository.createQueryBuilder('permission')
        .andWhere('"permission"."governmentId" = :governmentId', {governmentId})
        .innerJoinAndSelect('permission.user', 'user')
        .innerJoinAndSelect('permission.government', 'government')
        .leftJoinAndSelect('permission.campaign', 'campaign')
        .addOrderBy('"permission"."campaignId"', 'ASC')
        .getMany() as IUserPermissionResult[];

    return permissions.map(permission => {
        const userPermission: IUserPermission = {
            id: permission.id,
            role: permission.role,
            user: permission.user.toJSON(),
            government: {
                id: permission.government.id,
                name: permission.government.name,
            }
        };

        if (permission.campaign) {
            userPermission.campaign = {
                id: permission.campaign.id,
                name: permission.campaign.name
            };
        }
        return userPermission;
    });
}
