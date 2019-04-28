import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Government } from './Government';
import { Permission } from './Permission';
import { User } from './User';

@Entity()
export class Campaign {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => Government, government => government.campaigns)
    government: Government;

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
