import db from '../../models/db';
import { md5, User, UserStatus } from '../../models/entity/User';
import { truncateAll } from '../factories';

let userRepository: any;

describe('User', () => {
    beforeEach(async () => {
        const dataSource = await db();
        userRepository = dataSource.getRepository('User');
    });

    afterEach(async () => {
        await truncateAll();
    });

    it('md5', async () => {
        const hashObject = md5('password');
        expect(hashObject).toEqual('5f4dcc3b5aa765d61d8327deb882cf99');
    });

    it('setPassword', async () => {
        const user = new User();
        expect(user.passwordHash).toBeUndefined();
        expect(user.salt).toBeUndefined();
        user.setPassword('password');
        expect(user.passwordHash).toBeDefined();
        expect(user.salt).toBeDefined();
    });

    describe('Validations', () => {
        it('firstName lastName', async () => {
            const user = new User();
            await user.validateAsync();
            expect(user.errors[0].property).toEqual('firstName');
            expect(user.errors[0].constraints.isDefined).toEqual('firstName should not be null or undefined');
            expect(user.errors[1].property).toEqual('lastName');
            expect(user.errors[1].constraints.isDefined).toEqual('lastName should not be null or undefined');
        });

        it('passswordHash', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            await user.validateAsync();
            expect(user.errors[0].property).toEqual('passwordHash');
            expect(user.errors[0].constraints.isDefined).toEqual('passwordHash should not be null or undefined');
        });

        it('email null', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            await user.validateAsync();
            expect(user.errors[0].property).toEqual('email');
            expect(user.errors[0].constraints.isDefined).toEqual('email should not be null or undefined');
        });

        it('isValid', async () => {
            const user = new User();
            expect(await user.isValidAsync()).toBeFalsy();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'dan@civicsoftwarefoundation.org';
            expect(await user.isValidAsync()).toBeTruthy();
        });

        it('validate throws error', async () => {
            const user = new User();
            try {
                await userRepository.save(user);
            } catch (e) {
                expect(e.message).toEqual('user has one or more validation problems');
            }
        });

        it('validate does not throws error', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'dan@civicsoftwarefoundation.org';
            expect(await userRepository.count()).toEqual(0);
            await userRepository.save(user);
            expect(await userRepository.count()).toEqual(1);
        });
    });

    describe('JSON', () => {
        it('toJson', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'dan@civicsoftwarefoundation.org';
            await userRepository.save(user);
            const userJson = user.toJSON();
            expect(userJson.id).toBeDefined();
            expect(userJson.firstName).toEqual('Dan');
            expect(userJson.lastName).toEqual('Melton');
            expect(userJson.email).toEqual('dan@civicsoftwarefoundation.org');
        });
    });

    it('generateInvitationCode', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.invitationCode).toEqual(code);
        expect(user.userStatus).toEqual(UserStatus.INVITED);
        await userRepository.save(user);
        expect(user.validatePassword(code)).toBeTruthy();
    });

    it('redeemInvitation succeeds', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.userStatus).toEqual(UserStatus.INVITED);
        expect(user.invitationCode).toEqual(code);
        await userRepository.save(user);
        user.redeemInvitation(code, 'password');
        await userRepository.save(user);
        expect(user.invitationCode).toBeNull();
        expect(user.userStatus).toEqual(UserStatus.ACTIVE);
        expect(user.validatePassword('password')).toBeTruthy();
    });

    it('redeemInvitation fails', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.userStatus).toEqual(UserStatus.INVITED);
        await userRepository.save(user);
        user.redeemInvitation('111', 'password');
        await userRepository.save(user);
        expect(user.invitationCode).toEqual(code);
        expect(user.userStatus).toEqual(UserStatus.INVITED);
        expect(user.validatePassword('password')).toBeFalsy();
    });

    it('generatePasswordResetCode fails invalid userstatus', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.userStatus).toEqual(UserStatus.INVITED);
        expect(user.invitationCode).toEqual(code);
        await userRepository.save(user);
        try {
            user.generatePasswordResetCode();
        } catch (e) {
            expect(e.message).toEqual('Cannot reset an inactive or invited user');
        }
    });

    it('generatePasswordResetCode succeeds', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        user.setPassword('password');
        user.userStatus = UserStatus.ACTIVE;
        await userRepository.save(user);
        expect(user.invitationCode).toBeNull();
        user.generatePasswordResetCode();
        expect(user.invitationCode).toBeDefined();
    });

    it('resetPassword fails invalid userStatus', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.userStatus).toEqual(UserStatus.INVITED);
        expect(user.invitationCode).toEqual(code);
        await userRepository.save(user);
        try {
            user.resetPassword(code, 'password');
        } catch (e) {
            expect(e.message).toEqual('Cannot reset an inactive or invited user');
        }
    });

    it('resetPassword fails invalid code', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        user.userStatus = UserStatus.INVITED;
        user.generateInvitationCode();
        await userRepository.save(user);
        try {
            user.resetPassword('love', 'password');
        } catch (e) {
            expect(e.message).toEqual('Cannot reset an inactive or invited user');
        }
    });

    it('resetPassword succeeds', async () => {
        let user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        user.setPassword('password');
        user.userStatus = UserStatus.ACTIVE;
        await userRepository.save(user);
        expect(user.invitationCode).toBeNull();
        user.generatePasswordResetCode();
        expect(user.invitationCode).toBeDefined();
        user.resetPassword(user.invitationCode, 'passwordchanged');
        user = await userRepository.save(user);
        expect(user.validatePassword('passwordchanged')).toBeTruthy();
    });
});
