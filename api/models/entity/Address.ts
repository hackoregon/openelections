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
        name: 'FIRST_NAME'
    })
    firstName: string;

    @Column({
        name: 'LAST_NAME'
    })
    lastName: string;

    @Column({
        name: 'COUNTY'
    })
    county: string;

    @Column({
        name: 'ADDRESS_1'
    })
    address1: string;

    @Column({
        name: 'ADDRESS_2'
    })
    address2: string;

    @Column({
        name: 'CITY'
    })
    city: string;

    @Column({
        name: 'STATE'
    })
    state: string;

    @Column({
        name: 'ZIP_CODE'
    })
    zip: string;

    @Column({
        name: 'ZIP_PLUS_FOUR'
    })
    zipPlusFour: string;

    @PrimaryGeneratedColumn()
    id: number;
}
