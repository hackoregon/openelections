import * as sinon from 'sinon';
import * as faker from 'faker';
import {
    acceptUserInvitationAsync,
    createUserAsync,
    createUserSessionFromLoginAsync,
    generatePasswordResetAsync,
    passwordResetAsync,
    resendInvitationAsync,
    retrieveUserPermissionsAsync,
    updateUserPasswordAsync
} from '../../services/userService';
import { User, UserStatus } from '../../models/entity/User';
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import * as emails from '../../services/emailService';
import {
    addPermissionAsync,
    decipherJWTokenAsync,
    isCampaignAdminAsync,
    isGovernmentAdminAsync
} from '../../services/permissionService';
import { UserRole } from '../../models/entity/Permission';
import { Government } from '../../models/entity/Government';
import { Campaign } from '../../models/entity/Campaign';
import {newActiveUserAsync, newCampaignAsync, newGovernmentAsync} from '../factories';

let userRepository: any;
let campaignRepository: any;
let governmentRepository: any;
let mockEmail: any;
let govUser: User;
let campaignAdminUser: User;
let campaignStaffUser: User;
let government: Government;
let campaign: Campaign;

describe('userService', () => {
    before(() => {
        userRepository = getConnection('default').getRepository('User');
        governmentRepository = getConnection('default').getRepository('Government');
        campaignRepository = getConnection('default').getRepository('Campaign');
    });

    beforeEach(() => {
        mockEmail = sinon.mock(emails);
    });

    afterEach(async() => {
        await userRepository.query('TRUNCATE "user" CASCADE');
        await governmentRepository.query('TRUNCATE "government" CASCADE');
        await campaignRepository.query('TRUNCATE "campaign" CASCADE');
        sinon.reset();
    });

    it('Creates the user', async () => {
        expect(await userRepository.count()).equal(0);
        const user = await createUserAsync({
            email: faker.internet.email(),
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
            user.email = faker.internet.email();
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
            user.email = faker.internet.email();
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
            user.email = faker.internet.email();
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
                expect(e.message).to.equal('Could not find any entity of type "User" matching: {\n    "email": "dan@hello.com"\n}');
            }
        });
    });

    context('passwordResetAsync', () => {
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
            mockEmail.verify();
            expect(user.validatePassword('password')).to.be.true;
            await passwordResetAsync(code, 'password1');
            user = await userRepository.findOne(user.id) as User;
            expect(user.validatePassword('password1')).to.be.true;
            expect(user.invitationCode).to.be.null;
        });
    });

    context('createUserSessionFromLoginAsync', () => {
        it('succeeds', async () => {
            const user = await newActiveUserAsync();
            const token = await createUserSessionFromLoginAsync(user.email, 'password');
            const tokenObj = await decipherJWTokenAsync(token);
            expect(tokenObj.email).to.equal(user.email);
        });

        it('fails no email found', async () => {
            try {
                await createUserSessionFromLoginAsync('dan@hello.com', 'password');
            } catch (e) {
                expect(e.message).to.equal('Invalid email or password');
            }
        });

        it('fails wrong password', async () => {
            const user = await newActiveUserAsync();
            try {
                await createUserSessionFromLoginAsync(user.email, 'password1');
            } catch (e) {
                expect(e.message).to.equal('Invalid email or password');
            }
        });
    });

    context('updateUserPasswordAsync', () => {
        it('succeeds', async () => {
            let user = await newActiveUserAsync();
            expect(user.validatePassword('password')).to.be.true;
            await updateUserPasswordAsync(user.id, 'password', 'newpassword');
            user = await userRepository.findOne(user.id) as User;
            expect(user.validatePassword('newpassword')).to.be.true;
        });

        it('fails user not found', async () => {
            try {
                await updateUserPasswordAsync(1100, 'password', 'newpassword');
            } catch (e) {
             expect(e.message).to.equal('Could not find any entity of type "User" matching: 1100');
            }
        });

        it('fails invalid current password', async () => {
            let user = await newActiveUserAsync();
            expect(user.validatePassword('password')).to.be.true;
            try {
                await updateUserPasswordAsync(user.id, 'password1', 'newpassword');
            } catch (e) {
                expect(e.message).to.equal('Invalid password');
            }

            user = await userRepository.findOne(user.id) as User;
            expect(user.validatePassword('password')).to.be.true;
        });

        it('fails invalid new password length', async () => {
            let user = await newActiveUserAsync();
            expect(user.validatePassword('password')).to.be.true;
            try {
                await updateUserPasswordAsync(user.id, 'password', 'new');
            } catch (e) {
                expect(e.message).to.equal('Invalid password');
            }

            user = await userRepository.findOne(user.id) as User;
            expect(user.validatePassword('password')).to.be.true;
        });
    });

    context('resendInvitationAsync', () => {

        it('succeeds', async () => {
            const user = new User();
            user.email = faker.internet.email();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.generateInvitationCode();
            await userRepository.save(user);
            expect(user.invitationCode).to.not.be.null;
            mockEmail.expects('resendInvitationEmail').once();
            await resendInvitationAsync(user.id);
            mockEmail.verify();
        });

        it('fails no user', async () => {
            try {
                await resendInvitationAsync(1100);
            } catch (e) {
                expect(e.message).to.equal('Could not find any entity of type "User" matching: 1100');
            }
        });

        it('fails user status is not invited', async () => {
            const user = await newActiveUserAsync();
            try {
                await resendInvitationAsync(user.id);
            } catch (e) {
                expect(e.message).to.equal('User is already in the system or there is no invitation code');
            }
        });
    });

    describe('retrieveUserPermissionsAsync', () => {

        beforeEach(async () => {
            govUser = await newActiveUserAsync();
            campaignAdminUser = await newActiveUserAsync();
            campaignStaffUser = await newActiveUserAsync();

            government = await newGovernmentAsync();

            campaign = await newCampaignAsync(government);

            await addPermissionAsync({
                userId: govUser.id,
                role: UserRole.GOVERNMENT_ADMIN,
                governmentId: government.id
            });

            await addPermissionAsync({
                userId: campaignAdminUser.id,
                role: UserRole.CAMPAIGN_ADMIN,
                campaignId: campaign.id
            });

            await addPermissionAsync({
                userId: campaignStaffUser.id,
                role: UserRole.CAMPAIGN_STAFF,
                campaignId: campaign.id
            });
        });

        it('returns [] if user not campaignAdmin or governmentAdmin', async () => {
            expect(await isCampaignAdminAsync(campaignStaffUser.id, campaign.id)).to.be.false;
            expect(await isGovernmentAdminAsync(campaignStaffUser.id, campaign.government.id)).to.be.false;
            let users = await retrieveUserPermissionsAsync({ currentUserId: campaignStaffUser.id, campaignId: campaign.id});
            expect(users.length).to.equal(0);
            users = await retrieveUserPermissionsAsync({ currentUserId: campaignStaffUser.id, governmentId: campaign.government.id});
            expect(users.length).to.equal(0);
        });

        it('returns [campaignAdmin, campaignStaff] or [] if the currentUser is campaignAdmin', async () => {
            expect(await isCampaignAdminAsync(campaignAdminUser.id, campaign.id)).to.be.true;
            expect(await isGovernmentAdminAsync(campaignAdminUser.id, campaign.government.id)).to.be.false;
            let users = await retrieveUserPermissionsAsync({ currentUserId: campaignAdminUser.id, campaignId: campaign.id});
            expect(users.length).to.equal(2);
            users = await retrieveUserPermissionsAsync({ currentUserId: campaignAdminUser.id, governmentId: campaign.government.id});
            expect(users.length).to.equal(0);
        });

        it('returns [campaignAdmin, campaignStaff] or [govUser, campaignAdmin, campaignStaff] if the currentUser is governmentAdmin', async () => {
            expect(await isCampaignAdminAsync(govUser.id, campaign.id)).to.be.false;
            expect(await isGovernmentAdminAsync(govUser.id, campaign.government.id)).to.be.true;
            let users = await retrieveUserPermissionsAsync({ currentUserId: govUser.id, campaignId: campaign.id});
            expect(users.length).to.equal(2);
            users = await retrieveUserPermissionsAsync({ currentUserId: govUser.id, governmentId: campaign.government.id});
            expect(users.length).to.equal(3);
        });
    });
});
