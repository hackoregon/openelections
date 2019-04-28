import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Campaign } from './Campaign';
import { Permission } from './Permission';

@Entity()
export class Government {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Campaign, campaign => campaign.government)
    campaigns: Campaign[];

    @OneToMany(type => Permission, permission => permission.government )
    permissions: Permission[];

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
