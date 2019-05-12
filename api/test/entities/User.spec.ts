import { md5, User, UserStatus } from '../../models/entity/User';
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { truncateAll } from '../factories';

let userRepository: any;

describe('User', () => {
    before(() => {
        userRepository = getConnection('default').getRepository('User');
    });

    afterEach(async () => {
        await truncateAll();
    });

    it('md5', async () => {
        const hashObject = md5('password');
        expect(hashObject).to.equal('5f4dcc3b5aa765d61d8327deb882cf99');
    });

    it('setPassword', async () => {
        const user = new User();
        expect(user.passwordHash).to.be.undefined;
        expect(user.salt).to.be.undefined;
        user.setPassword('password');
        expect(user.passwordHash).to.not.be.undefined;
        expect(user.salt).to.not.be.undefined;
    });

    context('Validations', () => {
        it('firstName lastName', async () => {
            const user = new User();
            await user.validateAsync();
            expect(user.errors[0].property).equal('firstName');
            expect(user.errors[0].constraints.isDefined).equal('firstName should not be null or undefined');
            expect(user.errors[1].property).equal('lastName');
            expect(user.errors[1].constraints.isDefined).equal('lastName should not be null or undefined');
        });

        it('passswordHash', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            await user.validateAsync();
            expect(user.errors[0].property).equal('passwordHash');
            expect(user.errors[0].constraints.isDefined).equal('passwordHash should not be null or undefined');
        });

        it('email null', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            await user.validateAsync();
            expect(user.errors[0].property).equal('email');
            expect(user.errors[0].constraints.isDefined).equal('email should not be null or undefined');
        });

        it('isValid', async () => {
            const user = new User();
            expect(await user.isValidAsync()).to.be.false;
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'dan@civicsoftwarefoundation.org';
            expect(await user.isValidAsync()).to.be.true;
        });

        it('validate throws error', async () => {
            const user = new User();
            try {
                await userRepository.save(user);
            } catch (e) {
                expect(e.message).to.equal('user has one or more validation problems');
            }
        });

        it('validate does not throws error', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'dan@civicsoftwarefoundation.org';
            expect(await userRepository.count()).equal(0);
            await userRepository.save(user);
            expect(await userRepository.count()).equal(1);
        });

    });

    context('JSON', () => {
        it('toJson', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'dan@civicsoftwarefoundation.org';
            await userRepository.save(user);
            const userJson = user.toJSON();
            expect(userJson.id).to.not.be.undefined;
            expect(userJson.firstName).to.equal('Dan');
            expect(userJson.lastName).to.equal('Melton');
            expect(userJson.email).to.equal('dan@civicsoftwarefoundation.org');
        });
    });

    it('generateInvitationCode', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.invitationCode).to.equal(code);
        expect(user.userStatus).to.equal(UserStatus.INVITED);
        await userRepository.save(user);
        expect(user.validatePassword(code)).to.be.true;
    });

    it('redeemInvitation succeeds', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.userStatus).to.equal(UserStatus.INVITED);
        expect(user.invitationCode).to.equal(code);
        await userRepository.save(user);
        user.redeemInvitation(code, 'password');
        await userRepository.save(user);
        expect(user.invitationCode).to.be.null;
        expect(user.userStatus).to.equal(UserStatus.ACTIVE);
        expect(user.validatePassword('password')).to.be.true;
    });

    it('redeemInvitation fails', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.userStatus).to.equal(UserStatus.INVITED);
        await userRepository.save(user);
        user.redeemInvitation('111', 'password');
        await userRepository.save(user);
        expect(user.invitationCode).to.equal(code);
        expect(user.userStatus).to.equal(UserStatus.INVITED);
        expect(user.validatePassword('password')).to.be.false;
    });

    it('generatePasswordResetCode fails invalid userstatus', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.userStatus).to.equal(UserStatus.INVITED);
        expect(user.invitationCode).to.equal(code);
        await userRepository.save(user);
        try {
            user.generatePasswordResetCode();
        } catch (e) {
            expect(e.message).to.equal('Cannot reset an inactive or invited user');
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
        expect(user.invitationCode).to.be.null;
        user.generatePasswordResetCode();
        expect(user.invitationCode).to.not.be.null;
    });


    it('resetPassword fails invalid userStatus', async () => {
        const user = new User();
        user.firstName = 'Dan';
        user.lastName = 'Melton';
        user.email = 'dan@civicsoftwarefoundation.org';
        const code = user.generateInvitationCode();
        expect(user.userStatus).to.equal(UserStatus.INVITED);
        expect(user.invitationCode).to.equal(code);
        await userRepository.save(user);
        try {
            user.resetPassword(code, 'password');
        } catch (e) {
            expect(e.message).to.equal('Cannot reset an inactive or invited user');
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
            expect(e.message).to.equal('Cannot reset an inactive or invited user');
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
        expect(user.invitationCode).to.be.null;
        user.generatePasswordResetCode();
        expect(user.invitationCode).to.not.be.null;
        user.resetPassword(user.invitationCode, 'passwordchanged');
        user = await userRepository.save(user);
        expect(user.validatePassword('passwordchanged')).to.be.true;
    });
});

