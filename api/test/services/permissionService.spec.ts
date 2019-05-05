import { expect } from 'chai';
import * as sinon from 'sinon';
import * as faker from 'faker';
import { getConnection } from 'typeorm';
import * as jsonwebtoken from 'jsonwebtoken';
import { Campaign } from '../../models/entity/Campaign';
import { Government } from '../../models/entity/Government';
import { User } from '../../models/entity/User';
import { Permission, UserRole } from '../../models/entity/Permission';
import * as emails from '../../services/emailService';
import { createUserAsync } from '../../services/userService';
import {
    addPermissionAsync, addUserToCampaignAsync, addUserToGovernmentAsync, decipherJWTokenAsync, generateJWTokenAsync,
    isCampaignAdminAsync,
    isCampaignStaffAsync,
    isGovernmentAdminAsync, IToken, PermissionEntity, removePermissionAsync
} from '../../services/permissionService';


let permissionRepository: any;
let campaignRepository: any;
let governmentRepository: any;
let userRepository: any;
let government: Government;
let campaign: Campaign;
let govUser: User;
let campaignAdminUser: User;
let campaignStaffUser: User;
let mockEmail: any;

describe('Permission', () => {
    before(async () => {
        govUser = await createUserAsync({
            firstName: 'Dan',
            lastName: 'Melton',
            password: 'password',
            email: 'dan@civicsoftwarefoundation.org'
        });
        campaignAdminUser = await createUserAsync({
            firstName: 'Jane',
            lastName: 'Doe',
            password: 'password',
            email: 'jane@civicsoftwarefoundation.org'
        });
        campaignStaffUser = await createUserAsync({
            firstName: 'John',
            lastName: 'Doe',
            password: 'password',
            email: 'john@civicsoftwarefoundation.org'
        });
        campaignRepository = getConnection('default').getRepository('Campaign');
        governmentRepository = getConnection('default').getRepository('Government');
        permissionRepository = getConnection('default').getRepository('Permission');
        userRepository = getConnection('default').getRepository('User');
        government = new Government();
        government.name = 'City of Portland';
        await governmentRepository.save(government);
        campaign = new Campaign();
        campaign.name = 'Someone for Mayor';
        campaign.government = government;
        await campaignRepository.save(campaign);
    });

    beforeEach(() => {
        mockEmail = sinon.mock(emails);
    });

    afterEach(async () => {
        await permissionRepository.query('TRUNCATE "permission" CASCADE');
        sinon.reset();
    });

    after(async () => {
        await governmentRepository.query('TRUNCATE "government" CASCADE');
        await campaignRepository.query('TRUNCATE "campaign" CASCADE');
        await userRepository.query('TRUNCATE "user" CASCADE');
    });

    describe('permissionChecks', () => {
        beforeEach(async () => {
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

        afterEach(async () => {
            await permissionRepository.query('TRUNCATE "permission" CASCADE');
        });


        context('isGovernmentAdminAsync', async () => {
            it('true', async () => {
                expect(await (isGovernmentAdminAsync(govUser.id, government.id))).to.be.true;
            });

            it('false user does not exist', async () => {
                expect(await (isGovernmentAdminAsync(11, government.id))).to.be.false;
            });

            it('false user is campaign admin', async () => {
                expect(await (isGovernmentAdminAsync(campaignAdminUser.id, government.id))).to.be.false;
            });

            it('false user is campaign staff', async () => {
                expect(await (isGovernmentAdminAsync(campaignStaffUser.id, government.id))).to.be.false;
            });
        });

        context('isCampaignAdminAsync', async () => {
            it('true love', async () => {
                expect(await (isCampaignAdminAsync(campaignAdminUser.id, campaign.id))).to.be.true;
            });

            it('false user does not exist', async () => {
                expect(await (isCampaignAdminAsync(11000, campaign.id))).to.be.false;
            });

            it('false user is government admin', async () => {
                expect(await (isCampaignAdminAsync(govUser.id, campaign.id))).to.be.false;
            });

            it('false user is campaign staff', async () => {
                expect(await (isCampaignAdminAsync(campaignStaffUser.id, campaign.id))).to.be.false;
            });
        });

        context('isCampaignStaffAsync', async () => {
            it('true', async () => {
                expect(await (isCampaignStaffAsync(campaignStaffUser.id, campaign.id))).to.be.true;
            });

            it('false user does not exist', async () => {
                expect(await (isCampaignStaffAsync(11000, campaign.id))).to.be.false;
            });

            it('false user is government admin', async () => {
                expect(await (isCampaignStaffAsync(govUser.id, campaign.id))).to.be.false;
            });

            it('false user is campaign admin', async () => {
                expect(await (isCampaignStaffAsync(campaignAdminUser.id, campaign.id))).to.be.false;
            });
        });
    });

    context('addPermissionAsync', () => {
        context('fails', () => {
            it('no user found', async () => {
                try {
                    await addPermissionAsync({userId: 1100, role: UserRole.CAMPAIGN_ADMIN, campaignId: campaign.id});
                } catch (e) {
                    expect(e.message).to.equal('Could not find any entity of type "User" matching: 1100');
                }
            });

            it('no campaign found', async () => {
                try {
                    await addPermissionAsync({userId: campaignStaffUser.id, role: UserRole.CAMPAIGN_ADMIN, campaignId: 1100});
                } catch (e) {
                    expect(e.message).to.equal('Could not find any entity of type "Campaign" matching: 1100');
                }
            });

            it('no gov found', async () => {
                try {
                    await addPermissionAsync({userId: campaignStaffUser.id, role: UserRole.CAMPAIGN_ADMIN, governmentId: 1100});
                } catch (e) {
                    expect(e.message).to.equal('Could not find any entity of type "Government" matching: 1100');
                }
            });
        });

        context('succeeds', () => {
            it('adding gov admin', async () => {
                expect(await permissionRepository.count()).equal(0);
                await addPermissionAsync({userId: govUser.id, role: UserRole.GOVERNMENT_ADMIN, governmentId: government.id});
                expect(await permissionRepository.count()).equal(1);
            });

            it('adding campaign admin', async () => {
                expect(await permissionRepository.count()).equal(0);
                await addPermissionAsync({userId: campaignAdminUser.id, role: UserRole.CAMPAIGN_ADMIN, campaignId: campaign.id});
                expect(await permissionRepository.count()).equal(1);
            });

            it('adding campaign staff', async () => {
                expect(await permissionRepository.count()).equal(0);
                await addPermissionAsync({userId: campaignStaffUser.id, role: UserRole.CAMPAIGN_STAFF, campaignId: campaign.id});
                expect(await permissionRepository.count()).equal(1);
            });
        });
    });

    context('removePermissionsAsync', () => {
        it('fails id not found', async () => {
            try {
                await removePermissionAsync(1100);
            } catch (e) {
                expect(e.message).to.equal('Could not find any entity of type "Permission" matching: 1100');
            }
        });

        it('succeeds', async () => {
            expect(await permissionRepository.count()).equal(0);
            const permission = await addPermissionAsync({userId: govUser.id, role: UserRole.GOVERNMENT_ADMIN, governmentId: government.id});
            expect(await permissionRepository.count()).equal(1);
            expect(await removePermissionAsync(permission.id)).to.be.true;
            expect(await permissionRepository.count()).equal(0);
        });
    });

    context('addUserToGovernmentAsync', () => {
        context('fails', () => {
            it('governmentId not found', async () => {
                try {
                    await addUserToGovernmentAsync({
                        role: UserRole.GOVERNMENT_ADMIN,
                        governmentId: 1100,
                        currentUserId: 1000,
                        email: faker.internet.email(),
                        firstName: 'Dan',
                        lastName: 'Melton'
                    });
                } catch (e) {
                    expect(e.message).to.equal('Could not find any entity of type "Government" matching: 1100');
                }
            });

            it('campaign admin cannot add a government admin', async () => {
                await addPermissionAsync({userId: govUser.id, role: UserRole.CAMPAIGN_ADMIN, campaignId: campaign.id, governmentId: campaign.government.id});
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                try {
                    await addUserToGovernmentAsync({
                        role: UserRole.GOVERNMENT_ADMIN,
                        governmentId: government.id,
                        currentUserId: campaignStaffUser.id,
                        email: faker.internet.email(),
                        firstName: 'Dan',
                        lastName: 'Melton'
                    });
                } catch (e) {
                    expect(e.message).to.equal('user does not have sufficient permissions');
                }
                expect(await userRepository.count()).equal(userCount);
                expect(await permissionRepository.count()).equal(1);
            });

            it('campaign staff cannot add a government admin', async () => {
                await addPermissionAsync({userId: govUser.id, role: UserRole.CAMPAIGN_STAFF, campaignId: campaign.id, governmentId: campaign.government.id});
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                try {
                    await addUserToGovernmentAsync({
                        role: UserRole.GOVERNMENT_ADMIN,
                        governmentId: government.id,
                        currentUserId: campaignStaffUser.id,
                        email: faker.internet.email(),
                        firstName: 'Dan',
                        lastName: 'Melton'
                    });
                } catch (e) {
                    expect(e.message).to.equal('user does not have sufficient permissions');
                }
                expect(await userRepository.count()).equal(userCount);
                expect(await permissionRepository.count()).equal(1);
            });
        });

        context( 'succeeds', () => {
            it('government admin can add another government admin testme', async () => {
                await addPermissionAsync({
                    userId: govUser.id,
                    role: UserRole.GOVERNMENT_ADMIN,
                    governmentId: campaign.government.id
                });
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                const email = faker.internet.email();
                mockEmail.expects('sendNewUserInvitationEmail').once();
                await addUserToGovernmentAsync({
                    role: UserRole.GOVERNMENT_ADMIN,
                    governmentId: government.id,
                    currentUserId: govUser.id,
                    email,
                    firstName: 'Dan',
                    lastName: 'Melton'
                });
                expect((await userRepository.count())).equal(userCount + 1);
                expect(await permissionRepository.count()).equal(2);
                mockEmail.verify();
            });

            it('new user is not created', async () => {
                await addPermissionAsync({
                    userId: govUser.id,
                    role: UserRole.GOVERNMENT_ADMIN,
                    governmentId: campaign.government.id
                });
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                mockEmail.expects('sendInvitationEmail').once();
                await addUserToGovernmentAsync({
                    role: UserRole.GOVERNMENT_ADMIN,
                    governmentId: government.id,
                    currentUserId: govUser.id,
                    email: campaignAdminUser.email,
                    firstName: 'Dan',
                    lastName: 'Melton'
                });
                mockEmail.verify();
                expect((await userRepository.count())).equal(userCount);
                expect(await permissionRepository.count()).equal(2);
            });
        });
    });

    context('addUserToCampaignAsync', () => {
        context('fails', () => {
            it('campaign not found', async () => {
                try {
                    await addUserToCampaignAsync({
                        role: UserRole.GOVERNMENT_ADMIN,
                        campaignId: 1100,
                        currentUserId: 1000,
                        email: faker.internet.email(),
                        firstName: 'Dan',
                        lastName: 'Melton'
                    });
                } catch (e) {
                    expect(e.message).to.equal('Could not find any entity of type "Campaign" matching: 1100');
                }
            });

            it('campaign staff cannot add users', async () => {
                await addPermissionAsync({userId: govUser.id, role: UserRole.CAMPAIGN_STAFF, campaignId: campaign.id, governmentId: campaign.government.id});
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                try {
                    await addUserToCampaignAsync({
                        role: UserRole.CAMPAIGN_STAFF,
                        campaignId: campaign.id,
                        currentUserId: campaignStaffUser.id,
                        email: faker.internet.email(),
                        firstName: 'Dan',
                        lastName: 'Melton'
                    });
                } catch (e) {
                    expect(e.message).to.equal('user does not have sufficient permissions');
                }
                expect((await userRepository.count())).equal(userCount);
                expect(await permissionRepository.count()).equal(1);
            });
        });

        context('succeeds', () => {

            it('government admin can add campaign admin', async () => {
                await addPermissionAsync({
                    userId: govUser.id,
                    role: UserRole.GOVERNMENT_ADMIN,
                    governmentId: campaign.government.id
                });
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                mockEmail.expects('sendNewUserInvitationEmail').once();
                await addUserToCampaignAsync({
                    role: UserRole.CAMPAIGN_ADMIN,
                    campaignId: campaign.id,
                    currentUserId: govUser.id,
                    email: faker.internet.email(),
                    firstName: 'Dan',
                    lastName: 'Melton'
                });
                mockEmail.verify();
                expect((await userRepository.count())).equal(userCount + 1);
                expect(await permissionRepository.count()).equal(2);
            });

            it('government admin can add campaign staff', async () => {
                await addPermissionAsync({
                    userId: govUser.id,
                    role: UserRole.GOVERNMENT_ADMIN,
                    governmentId: campaign.government.id
                });
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                mockEmail.expects('sendNewUserInvitationEmail').once();
                await addUserToCampaignAsync({
                    role: UserRole.CAMPAIGN_STAFF,
                    campaignId: campaign.id,
                    currentUserId: govUser.id,
                    email: faker.internet.email(),
                    firstName: 'Dan',
                    lastName: 'Melton'
                });
                mockEmail.verify();
                expect((await userRepository.count())).equal(userCount + 1);
                expect(await permissionRepository.count()).equal(2);
            });

            it('campaign admin can add campaign admin', async () => {
                await addPermissionAsync({
                    userId: campaignAdminUser.id,
                    role: UserRole.CAMPAIGN_ADMIN,
                    campaignId: campaign.id
                });
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                mockEmail.expects('sendNewUserInvitationEmail').once();
                await addUserToCampaignAsync({
                    role: UserRole.CAMPAIGN_ADMIN,
                    campaignId: campaign.id,
                    currentUserId: campaignAdminUser.id,
                    email: faker.internet.email(),
                    firstName: 'Dan',
                    lastName: 'Melton'
                });
                mockEmail.verify();
                expect((await userRepository.count())).equal(userCount + 1);
                expect(await permissionRepository.count()).equal(2);
            });

            it('campaign admin can add campaign staff', async () => {
                await addPermissionAsync({
                    userId: campaignAdminUser.id,
                    role: UserRole.CAMPAIGN_ADMIN,
                    campaignId: campaign.id
                });
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                mockEmail.expects('sendNewUserInvitationEmail').once();
                await addUserToCampaignAsync({
                    role: UserRole.CAMPAIGN_STAFF,
                    campaignId: campaign.id,
                    currentUserId: campaignAdminUser.id,
                    email: faker.internet.email(),
                    firstName: 'Dan',
                    lastName: 'Melton'
                });
                mockEmail.verify();
                expect((await userRepository.count())).equal(userCount + 1);
                expect(await permissionRepository.count()).equal(2);
            });

            it('new user not created if exists', async () => {
                await addPermissionAsync({
                    userId: campaignAdminUser.id,
                    role: UserRole.CAMPAIGN_ADMIN,
                    campaignId: campaign.id
                });
                expect(await permissionRepository.count()).equal(1);
                const userCount = await userRepository.count();
                mockEmail.expects('sendInvitationEmail').once();
                await addUserToCampaignAsync({
                    role: UserRole.CAMPAIGN_STAFF,
                    campaignId: campaign.id,
                    currentUserId: campaignAdminUser.id,
                    email: campaignStaffUser.email,
                    firstName: 'Dan',
                    lastName: 'Melton'
                });
                mockEmail.verify()
                expect((await userRepository.count())).equal(userCount);
                expect(await permissionRepository.count()).equal(2);
            });
        });
    });

    describe('generateJWTokenAsync and decipherJWToken', () => {

        beforeEach(async () => {
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

        afterEach(async () => {
            await permissionRepository.query('TRUNCATE "permission" CASCADE');
        });

        it('fails no user found', async () => {
            try {
                await generateJWTokenAsync(1100);
            } catch (e) {
                expect(e.message).to.equal('Could not find any entity of type "User" matching: 1100');
            }

        });

        it('fails invalid token', async () => {
            try {
                await decipherJWTokenAsync('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
            } catch (e) {
                expect(e.message).to.equal('invalid signature');
            }

        });

        it('fails token expired', async () => {
            const tokenObj = {
                exp: Date.now() - 10000
            };
            const token = jsonwebtoken.sign(tokenObj, process.env.SECRET_KEY);
            try {
                await decipherJWTokenAsync(token);
            } catch (e) {
                expect(e.message).to.equal('Token expired');
            }
        });


        it('government admin', async () => {
            const token = await generateJWTokenAsync(govUser.id);
            const decodedToken = await decipherJWTokenAsync(token);
            expect(decodedToken.id).to.equal(govUser.id);
            expect(decodedToken.firstName).to.equal(govUser.firstName);
            expect(decodedToken.lastName).to.equal(govUser.lastName);
            expect(decodedToken.email).to.equal(govUser.email);
            expect(decodedToken.exp > Date.now()).to.be.true;
            expect(decodedToken.exp < (Date.now() + 72.5 * 60 * 60 * 1000)).to.be.true;
            expect(decodedToken.permissions[0].role).to.equal(UserRole.GOVERNMENT_ADMIN);
            expect(decodedToken.permissions[0].type).to.equal(PermissionEntity.GOVERNMENT);
            expect(decodedToken.permissions[0].id).to.equal(government.id);
        });

        it('campaign admin', async () => {
            const token = await generateJWTokenAsync(campaignAdminUser.id);
            const decodedToken = await decipherJWTokenAsync(token);
            expect(decodedToken.id).to.equal(campaignAdminUser.id);
            expect(decodedToken.firstName).to.equal(campaignAdminUser.firstName);
            expect(decodedToken.lastName).to.equal(campaignAdminUser.lastName);
            expect(decodedToken.email).to.equal(campaignAdminUser.email);
            expect(decodedToken.exp > Date.now()).to.be.true;
            expect(decodedToken.exp < (Date.now() + 72.5 * 60 * 60 * 1000)).to.be.true;
            expect(decodedToken.permissions[0].role).to.equal(UserRole.CAMPAIGN_ADMIN);
            expect(decodedToken.permissions[0].type).to.equal(PermissionEntity.CAMPAIGN);
            expect(decodedToken.permissions[0].id).to.equal(campaign.id);
        });

        it('campaign staff', async () => {
            const token = await generateJWTokenAsync(campaignStaffUser.id);
            const decodedToken = await decipherJWTokenAsync(token);
            expect(decodedToken.id).to.equal(campaignStaffUser.id);
            expect(decodedToken.firstName).to.equal(campaignStaffUser.firstName);
            expect(decodedToken.lastName).to.equal(campaignStaffUser.lastName);
            expect(decodedToken.email).to.equal(campaignStaffUser.email);
            expect(decodedToken.exp > Date.now()).to.be.true;
            expect(decodedToken.exp < (Date.now() + 72.5 * 60 * 60 * 1000)).to.be.true;
            expect(decodedToken.permissions[0].role).to.equal(UserRole.CAMPAIGN_STAFF);
            expect(decodedToken.permissions[0].type).to.equal(PermissionEntity.CAMPAIGN);
            expect(decodedToken.permissions[0].id).to.equal(campaign.id);
        });
    });


});
