import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Campaign } from '../../models/entity/Campaign';
import { Government } from '../../models/entity/Government';
import { User } from '../../models/entity/User';
import {
    getPermissionsByCampaignIdAsync,
    getPermissionsByGovernmentIdAsync,
    Permission,
    UserRole
} from '../../models/entity/Permission';
import { newActiveUserAsync, newCampaignAsync, newGovernmentAsync, truncateAll } from '../factories';


let permissionRepository: any;
let campaignRepository: any;
let governmentRepository: any;
let userRepository: any;
let government: Government;
let campaign: Campaign;
let campaign2: Campaign;
let user: User;
let user2: User;

describe('Permission', () => {
    beforeEach(async () => {
        user = await newActiveUserAsync();
        user2 = await newActiveUserAsync();
        campaignRepository = getConnection('default').getRepository('Campaign');
        governmentRepository = getConnection('default').getRepository('Government');
        permissionRepository = getConnection('default').getRepository('Permission');
        userRepository = getConnection('default').getRepository('User');
        government = await newGovernmentAsync();
        campaign = await newCampaignAsync(government);
        campaign2 = await newCampaignAsync(government);
    });

    afterEach(async () => {
        await truncateAll();
    });

    context('Validations', () => {
        it('role', async () => {
            const permission = new Permission();
            await permission.validateAsync();
            expect(permission.errors.length).to.equal(4);
            expect(permission.errors[0].property).equal('role');
            expect(permission.errors[0].constraints.isDefined).equal('role should not be null or undefined');
        });

        it('user', async () => {
            const permission = new Permission();
            permission.role = UserRole.GOVERNMENT_ADMIN;
            await permission.validateAsync();
            expect(permission.errors.length).to.equal(2);
            expect(permission.errors[0].property).equal('userId');
            expect(permission.errors[0].constraints.isDefined).equal('userId should not be null or undefined');
        });

        it('governmentId', async () => {
            const permission = new Permission();
            permission.role = UserRole.GOVERNMENT_ADMIN;
            permission.user = user;
            await permission.validateAsync();
            expect(permission.errors.length).to.equal(1);
            expect(permission.errors[0].property).equal('governmentId');
            expect(permission.errors[0].constraints.isDefined).equal('governmentId should not be null or undefined');
        });

        it('campaignId', async () => {
            const permission = new Permission();
            permission.role = UserRole.CAMPAIGN_ADMIN;
            permission.user = user;
            permission.government = government;
            await permission.validateAsync();
            expect(permission.errors.length).to.equal(1);
            expect(permission.errors[0].property).equal('campaignId');
            expect(permission.errors[0].constraints.isDefined).equal('campaignId should not be null or undefined');
        });

        it('campaignId cannot be set if UserRole.GOVERNMENT_ADMIN', async () => {
            const permission = new Permission();
            permission.role = UserRole.GOVERNMENT_ADMIN;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            await permission.validateAsync();
            expect(permission.errors.length).to.equal(1);
            expect(permission.errors[0].property).equal('campaignId');
            expect(permission.errors[0].constraints.notAllowed).equal('campaignId cannot be set with GovernmentAdmin as a UserRole');
        });


        it('isValid Campaign Staff', async () => {
            const permission = new Permission();
            expect(await permission.isValidAsync()).to.be.false;
            permission.role = UserRole.CAMPAIGN_STAFF;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            expect(await permission.isValidAsync()).to.be.true;
        });

        it('isValid Campaign Admin', async () => {
            const permission = new Permission();
            expect(await permission.isValidAsync()).to.be.false;
            permission.role = UserRole.CAMPAIGN_ADMIN;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            expect(await permission.isValidAsync()).to.be.true;
        });

        it('isValid Government Admin', async () => {
            const permission = new Permission();
            expect(await permission.isValidAsync()).to.be.false;
            permission.role = UserRole.GOVERNMENT_ADMIN;
            permission.user = user;
            permission.government = government;
            expect(await permission.isValidAsync()).to.be.true;
        });

        it('save invalid throws error', async () => {
            const permission = new Permission();
            try {
                await permissionRepository.save(permission);
            } catch (e) {
                expect(e.message).to.equal('permission has one or more validation problems');
            }
        });

        it('saves valid Campaign Staff', async () => {
            const permission = new Permission();
            permission.role = UserRole.CAMPAIGN_STAFF;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            expect(await permissionRepository.count()).equal(0);
            await permissionRepository.save(permission);
            expect(await permissionRepository.count()).equal(1);
        });

        it('saves valid Campaign Admin', async () => {
            const permission = new Permission();
            permission.role = UserRole.CAMPAIGN_ADMIN;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            expect(await permissionRepository.count()).equal(0);
            await permissionRepository.save(permission);
            expect(await permissionRepository.count()).equal(1);
        });

        it('saves valid Government Admin', async () => {
            const permission = new Permission();
            permission.role = UserRole.GOVERNMENT_ADMIN;
            permission.user = user;
            permission.government = government;
            expect(await permissionRepository.count()).equal(0);
            await permissionRepository.save(permission);
            expect(await permissionRepository.count()).equal(1);
        });
    });

    context('getPermissions', () => {
        context('getPermissionsByCampaignIdAsync', () => {
            it('returns [] no campaignId found', async () => {
                const permission = new Permission();
                permission.role = UserRole.CAMPAIGN_STAFF;
                permission.user = user;
                permission.government = government;
                permission.campaign = campaign;
                await permissionRepository.save(permission);
                expect(await permissionRepository.count()).equal(1);
                const userPermissions = await getPermissionsByCampaignIdAsync(10);
                expect(userPermissions.length).to.equal(0);
            });

            it('returns [UserPermission] for campaign', async () => {
                const permission = new Permission();
                permission.role = UserRole.CAMPAIGN_STAFF;
                permission.user = user;
                permission.government = government;
                permission.campaign = campaign;
                await permissionRepository.save(permission);
                const permission2 = new Permission();
                permission2.role = UserRole.CAMPAIGN_ADMIN;
                permission2.user = user2;
                permission2.government = government;
                permission2.campaign = campaign2;
                await permissionRepository.save(permission);
                expect(await permissionRepository.count()).equal(1);
                const userPermissions = await getPermissionsByCampaignIdAsync(campaign.id);
                expect(userPermissions.length).to.equal(1);
                expect(Object.keys(userPermissions[0])).to.deep.equal(['id', 'role', 'user', 'campaign', 'government']);
                expect(Object.keys(userPermissions[0].user)).to.deep.equal(['id', 'firstName', 'lastName', 'email', 'userStatus']);
                expect(Object.keys(userPermissions[0].campaign)).to.deep.equal(['id', 'name']);
                expect(Object.keys(userPermissions[0].government)).to.deep.equal(['id', 'name']);
            });
        });

        context('getPermissionsByGovernmentIdAsync', () => {
            it('returns [] no governmentId found', async () => {
                const permission = new Permission();
                permission.role = UserRole.CAMPAIGN_STAFF;
                permission.user = user;
                permission.government = government;
                permission.campaign = campaign;
                await permissionRepository.save(permission);
                const permission2 = new Permission();
                permission2.role = UserRole.GOVERNMENT_ADMIN;
                permission2.user = user;
                permission2.government = government;
                await permissionRepository.save(permission2);
                expect(await permissionRepository.count()).equal(2);
                const userPermissions = await getPermissionsByGovernmentIdAsync(10);
                expect(userPermissions.length).to.equal(0);
            });

            it('returns 2 [UserPermission] for government', async () => {
                const permission = new Permission();
                permission.role = UserRole.CAMPAIGN_STAFF;
                permission.user = user;
                permission.government = government;
                permission.campaign = campaign;
                await permissionRepository.save(permission);
                const permission2 = new Permission();
                permission2.role = UserRole.GOVERNMENT_ADMIN;
                permission2.user = user2;
                permission2.government = government;
                await permissionRepository.save(permission2);
                expect(await permissionRepository.count()).equal(2);
                const userPermissions = await getPermissionsByGovernmentIdAsync(government.id);
                expect(userPermissions.length).to.equal(2);
                expect(Object.keys(userPermissions[0])).to.deep.equal(['id', 'role', 'user', 'government', 'campaign']);
                expect(Object.keys(userPermissions[0].campaign)).to.deep.equal(['id', 'name']);
                expect(Object.keys(userPermissions[0].user)).to.deep.equal(['id', 'firstName', 'lastName', 'email', 'userStatus']);
                expect(Object.keys(userPermissions[0].government)).to.deep.equal(['id', 'name']);

                expect(Object.keys(userPermissions[1])).to.deep.equal(['id', 'role', 'user', 'government']);
                expect(Object.keys(userPermissions[1].user)).to.deep.equal(['id', 'firstName', 'lastName', 'email', 'userStatus']);
                expect(Object.keys(userPermissions[1].government)).to.deep.equal(['id', 'name']);
            });
        });
    });

    it('retrieveCampaignAdminsAsync', async () => {

    })
});
