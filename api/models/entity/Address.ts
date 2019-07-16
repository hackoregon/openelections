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
        name: 'first_name'
    })
    firstName: string;

    @Column({
        name: 'last_name'
    })
    lastName: string;

    @Column({
        name: 'county'
    })
    county: string;

    @Column({
        name: 'address_1'
    })
    address1: string;

    @Column({
        name: 'address_2'
    })
    address2: string;

    @Column({
        name: 'city'
    })
    city: string;

    @Column({
        name: 'state'
    })
    state: string;

    @Column({
        name: 'zip_code'
    })
    zip: string;

    @Column({
        name: 'zip_plus_four'
    })
    zipPlusFour: string;

    @PrimaryGeneratedColumn()
    id: number;
}
