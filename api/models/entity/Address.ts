import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity({
    name: 'addresses'
})
export class Address {

    @Column({
        name: 'first_name',
        nullable: true,
    })
    firstName: string;

    @Column({
        name: 'last_name',
        nullable: true
    })
    lastName: string;

    @Column({
        name: 'county',
        nullable: true
    })
    county: string;

    @Column({
        name: 'address_1',
        nullable: true
    })
    address1: string;

    @Column({
        name: 'address_2',
        nullable: true
    })
    address2: string;

    @Column({
        name: 'city',
        nullable: true
    })
    city: string;

    @Column({
        name: 'state',
        nullable: true
    })
    state: string;

    @Column({
        name: 'zip_code',
        nullable: true
    })
    zip: string;

    @Column({
        name: 'zip_plus_four',
        nullable: true
    })
    zipPlusFour: string;

    @PrimaryGeneratedColumn('uuid')
    id: number;
}
