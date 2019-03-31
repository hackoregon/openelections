import { createUserAsync } from '../../services/userService';
import { User} from "../../models/entity/User";
import { expect } from 'chai';
import {getConnection} from "typeorm";

let userRepository: any;

describe('userService', () => {
    before(() => {
        userRepository = getConnection('default').getRepository('User');
    });

    afterEach(async() => {
        await userRepository.clear()
    });

    it('Creates the user', async () => {
        expect(await userRepository.count()).equal(0);
        await createUserAsync({
            email: 'dan@civicsoftwarefoundation.org',
            password: 'password',
            firstName: 'Dan',
            lastName: 'Melton'
        });
        expect(await userRepository.count()).equal(1);
    })
});
