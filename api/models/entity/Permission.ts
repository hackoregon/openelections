import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Government } from './Government';
import { Campaign } from './Campaign';
import { User } from './User';

export enum UserRole {
    GOVERNMENT_ADMIN = 'government_admin',
    CAMPAIGN_ADMIN = 'campaign_admin',
    CAMPAIGN_STAFF = 'campaign_staff',
}

@Entity()
export class Permission {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CAMPAIGN_STAFF
    })
    role: UserRole;


    @ManyToOne(type => Government, government => government.permissions)
    government: Government;

    @ManyToOne(type => Campaign, campaign => campaign.permissions)
    campaign: Campaign;

    @ManyToOne(type => User, user => user.permissions)
    user: User;


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
