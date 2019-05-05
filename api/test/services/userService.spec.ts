import { acceptUserInvitationAsync, createUserAsync } from '../../services/userService';
import {User, UserStatus} from '../../models/entity/User';
import { expect } from 'chai';
import { getConnection } from 'typeorm';

let userRepository: any;

describe('userService', () => {
    before(() => {
        userRepository = getConnection('default').getRepository('User');
    });

    afterEach(async() => {
        await userRepository.query('TRUNCATE "user" CASCADE');
    });

    it('Creates the user', async () => {
        expect(await userRepository.count()).equal(0);
        const user = await createUserAsync({
            email: 'dan@civicsoftwarefoundation.org',
            password: 'password',
            firstName: 'Dan',
            lastName: 'Melton'
        });
        expect(user.validatePassword('password')).equal(true);
        expect(await userRepository.count()).equal(1);
    });

    context('acceptUserInvitationAsync', () => {
        it('fails invitation not found', async () => {
            try {
                await acceptUserInvitationAsync({
                    invitationCode: 'notfound',
                    password: 'password'
                });
            } catch (e) {
                expect(e.message).to.equal('Could not find any entity of type "User" matching: {\n    "invitationCode": "notfound"\n}');
            }
        });

        it('fails password length incorrect', async () => {
            const user = new User();
            user.email = 'dan@civicsoftwarefoundation.org';
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.generateInvitationCode();
            await userRepository.save(user);
            try {
                await acceptUserInvitationAsync({
                    invitationCode: user.invitationCode,
                    password: 'passwod'
                });
            } catch (e) {
                expect(e.message).to.equal('User password must be at least 6 characters');
            }

        });

        it('succeeds', async () => {
            let user = new User();
            user.email = 'dan@civicsoftwarefoundation.org';
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.generateInvitationCode();
            await userRepository.save(user);
            user = await acceptUserInvitationAsync({
                invitationCode: user.invitationCode,
                password: 'password',
                firstName: 'Daniel',
                lastName: 'Meltonion'
            });
            expect(user.userStatus).to.equal(UserStatus.ACTIVE);
            expect(user.validatePassword('password')).to.be.true;
            expect(user.firstName).to.equal('Daniel');
            expect(user.lastName).to.equal('Meltonion');
        });
    });
});
