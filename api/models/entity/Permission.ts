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
    role: 'enum';
    enum: ['governmentAdmin', 'campaignAdmin', 'campaignStaff'];


    @ManyToOne(type => Government, government => government.permissions)
    government: Government;

    @ManyToOne(type => Campaign, campaign => campaign.permissions)
    campaign: Campaign;

    @ManyToOne(type => User, user => user.permissions)
    user: User;


    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
