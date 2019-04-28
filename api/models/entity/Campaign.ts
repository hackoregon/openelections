import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Government } from './Government';

@Entity()
export class Campaign {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;


    @ManyToOne(type => Government, government => government.campaigns)
    government: Government;

    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
