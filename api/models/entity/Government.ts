import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Campaign } from './Campaign';

@Entity()
export class Government {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => Campaign, campaign => campaign.government)
    campaigns: Campaign[];

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
