import * as sinon from 'sinon';
import {
    acceptUserInvitationAsync,
    createUserAsync,
    generatePasswordResetAsync,
    passwordResetAsync
} from '../../services/userService';
import { User, UserStatus } from '../../models/entity/User';
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import * as emails from '../../services/emailService';

let userRepository: any;
let mockEmail: any;

describe('userService', () => {
    before(() => {
        userRepository = getConnection('default').getRepository('User');
    });

    beforeEach(() => {
        mockEmail = sinon.mock(emails);
    });

    afterEach(async() => {
        await userRepository.query('TRUNCATE "user" CASCADE');
        sinon.reset();
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

    context('generatePasswordResetAsync', () => {
        it('succeeds', async () => {
            let user = new User();
            user.email = 'dan@civicsoftwarefoundation.org';
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.userStatus = UserStatus.ACTIVE;
            user.setPassword('password');
            await userRepository.save(user);
            expect(user.invitationCode).to.be.null;
            mockEmail.expects('sendPasswordResetEmail').once();
            const code = await generatePasswordResetAsync(user.email);
            user = await userRepository.findOne(user.id) as User;
            expect(user.invitationCode).to.equal(code);
            mockEmail.verify();
        });

        it('fails user has a status of invited', async () => {
            const user = new User();
            user.email = 'dan@civicsoftwarefoundation.org';
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.userStatus = UserStatus.INVITED;
            const code = user.generateInvitationCode();
            await userRepository.save(user);
            expect(user.invitationCode).to.equal(code);
            try {
                await generatePasswordResetAsync(user.email);
            } catch (e) {
                expect(e.message).to.equal('Cannot reset an inactive or invited user');
            }
        });

        it('fails user email not found', async () => {
            try {
                await generatePasswordResetAsync('dan@hello.com');
            } catch (e) {
                expect(e.message).to.equal('Could not find any entity of type "User" matching: {\n    "email": "dan@hello.com"\n}')
            }
        });
    });

    context('passwordResetAsync', () => {
        it('succeeds testme', async () => {
            let user = new User();
            user.email = 'dan@civicsoftwarefoundation.org';
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.userStatus = UserStatus.ACTIVE;
            user.setPassword('password');
            await userRepository.save(user);
            expect(user.invitationCode).to.be.null;
            mockEmail.expects('sendPasswordResetEmail').once();
            const code = await generatePasswordResetAsync(user.email);
            mockEmail.verify();
            expect(user.validatePassword('password')).to.be.true;
            await passwordResetAsync(code, 'password1');
            user = await userRepository.findOne(user.id) as User;
            expect(user.validatePassword('password1')).to.be.true;
            expect(user.invitationCode).to.be.null;
        })
    })
});
