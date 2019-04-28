import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Campaign } from './Campaign';
import { Permission } from './Permission';
import { User } from './User';

@Entity()
export class Government {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Campaign, campaign => campaign.government)
    campaigns: Campaign[];

    @ManyToMany(type => Permission)
    @JoinTable()
    users: User[];

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
