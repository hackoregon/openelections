import { Campaign } from '../../models/entity/Campaign';
import { Government } from '../../models/entity/Government';
import { User } from '../../models/entity/User';
import {
    getPermissionsByCampaignIdAsync,
    getPermissionsByGovernmentIdAsync,
    Permission,
    UserRole,
} from '../../models/entity/Permission';
import { newActiveUserAsync, newCampaignAsync, newGovernmentAsync, truncateAll } from '../factories';
import db from '../../models/db';

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
        const dataSource = await db();
        campaignRepository = dataSource.getRepository('Campaign');
        governmentRepository = dataSource.getRepository('Government');
        permissionRepository = dataSource.getRepository('Permission');
        userRepository = dataSource.getRepository('User');
        government = await newGovernmentAsync();
        campaign = await newCampaignAsync(government);
        campaign2 = await newCampaignAsync(government);
    });

    afterEach(async () => {
        await truncateAll();
    });

    describe('Validations', () => {
        it('role', async () => {
            const permission = new Permission();
            await permission.validateAsync();
            expect(permission.errors.length).toEqual(4);
            expect(permission.errors[0].property).toEqual('role');
            expect(permission.errors[0].constraints.isDefined).toEqual('role should not be null or undefined');
        });

        it('user', async () => {
            const permission = new Permission();
            permission.role = UserRole.GOVERNMENT_ADMIN;
            await permission.validateAsync();
            expect(permission.errors.length).toEqual(2);
            expect(permission.errors[0].property).toEqual('userId');
            expect(permission.errors[0].constraints.isDefined).toEqual('userId should not be null or undefined');
        });

        it('governmentId', async () => {
            const permission = new Permission();
            permission.role = UserRole.GOVERNMENT_ADMIN;
            permission.user = user;
            await permission.validateAsync();
            expect(permission.errors.length).toEqual(1);
            expect(permission.errors[0].property).toEqual('governmentId');
            expect(permission.errors[0].constraints.isDefined).toEqual('governmentId should not be null or undefined');
        });

        it('campaignId', async () => {
            const permission = new Permission();
            permission.role = UserRole.CAMPAIGN_ADMIN;
            permission.user = user;
            permission.government = government;
            await permission.validateAsync();
            expect(permission.errors.length).toEqual(1);
            expect(permission.errors[0].property).toEqual('campaignId');
            expect(permission.errors[0].constraints.isDefined).toEqual('campaignId should not be null or undefined');
        });

        it('campaignId cannot be set if UserRole.GOVERNMENT_ADMIN', async () => {
            const permission = new Permission();
            permission.role = UserRole.GOVERNMENT_ADMIN;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            await permission.validateAsync();
            expect(permission.errors.length).toEqual(1);
            expect(permission.errors[0].property).toEqual('campaignId');
            expect(permission.errors[0].constraints.notAllowed).toEqual(
                'campaignId cannot be set with GovernmentAdmin as a UserRole'
            );
        });

        it('isValid Campaign Staff', async () => {
            const permission = new Permission();
            expect(await permission.isValidAsync()).toBeFalsy();
            permission.role = UserRole.CAMPAIGN_STAFF;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            expect(await permission.isValidAsync()).toBeTruthy();
        });

        it('isValid Campaign Admin', async () => {
            const permission = new Permission();
            expect(await permission.isValidAsync()).toBeFalsy();
            permission.role = UserRole.CAMPAIGN_ADMIN;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            expect(await permission.isValidAsync()).toBeTruthy();
        });

        it('isValid Government Admin', async () => {
            const permission = new Permission();
            expect(await permission.isValidAsync()).toBeFalsy();
            permission.role = UserRole.GOVERNMENT_ADMIN;
            permission.user = user;
            permission.government = government;
            expect(await permission.isValidAsync()).toBeTruthy();
        });

        it('save invalid throws error', async () => {
            const permission = new Permission();
            try {
                await permissionRepository.save(permission);
            } catch (e) {
                expect(e.message).toEqual('permission has one or more validation problems');
            }
        });

        it('saves valid Campaign Staff', async () => {
            const permission = new Permission();
            permission.role = UserRole.CAMPAIGN_STAFF;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            expect(await permissionRepository.count()).toEqual(0);
            await permissionRepository.save(permission);
            expect(await permissionRepository.count()).toEqual(1);
        });

        it('saves valid Campaign Admin', async () => {
            const permission = new Permission();
            permission.role = UserRole.CAMPAIGN_ADMIN;
            permission.user = user;
            permission.government = government;
            permission.campaign = campaign;
            expect(await permissionRepository.count()).toEqual(0);
            await permissionRepository.save(permission);
            expect(await permissionRepository.count()).toEqual(1);
        });

        it('saves valid Government Admin', async () => {
            const permission = new Permission();
            permission.role = UserRole.GOVERNMENT_ADMIN;
            permission.user = user;
            permission.government = government;
            expect(await permissionRepository.count()).toEqual(0);
            await permissionRepository.save(permission);
            expect(await permissionRepository.count()).toEqual(1);
        });
    });

    describe('getPermissions', () => {
        describe('getPermissionsByCampaignIdAsync', () => {
            it('returns [] no campaignId found', async () => {
                const permission = new Permission();
                permission.role = UserRole.CAMPAIGN_STAFF;
                permission.user = user;
                permission.government = government;
                permission.campaign = campaign;
                await permissionRepository.save(permission);
                expect(await permissionRepository.count()).toEqual(1);
                const userPermissions = await getPermissionsByCampaignIdAsync(10);
                expect(userPermissions.length).toEqual(0);
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
                expect(await permissionRepository.count()).toEqual(1);
                const userPermissions = await getPermissionsByCampaignIdAsync(campaign.id);
                expect(userPermissions.length).toEqual(1);
                expect(Object.keys(userPermissions[0])).toEqual(['id', 'role', 'user', 'campaign', 'government']);
                expect(Object.keys(userPermissions[0].user)).toEqual([
                    'id',
                    'firstName',
                    'lastName',
                    'email',
                    'userStatus',
                ]);
                expect(Object.keys(userPermissions[0].campaign)).toEqual(['id', 'name']);
                expect(Object.keys(userPermissions[0].government)).toEqual(['id', 'name']);
            });
        });

        describe('getPermissionsByGovernmentIdAsync', () => {
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
                expect(await permissionRepository.count()).toEqual(2);
                const userPermissions = await getPermissionsByGovernmentIdAsync(10);
                expect(userPermissions.length).toEqual(0);
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
                expect(await permissionRepository.count()).toEqual(2);
                const userPermissions = await getPermissionsByGovernmentIdAsync(government.id);
                expect(userPermissions.length).toEqual(2);
                expect(Object.keys(userPermissions[0])).toEqual(['id', 'role', 'user', 'government', 'campaign']);
                expect(Object.keys(userPermissions[0].campaign)).toEqual(['id', 'name']);
                expect(Object.keys(userPermissions[0].user)).toEqual([
                    'id',
                    'firstName',
                    'lastName',
                    'email',
                    'userStatus',
                ]);
                expect(Object.keys(userPermissions[0].government)).toEqual(['id', 'name']);

                expect(Object.keys(userPermissions[1])).toEqual(['id', 'role', 'user', 'government']);
                expect(Object.keys(userPermissions[1].user)).toEqual([
                    'id',
                    'firstName',
                    'lastName',
                    'email',
                    'userStatus',
                ]);
                expect(Object.keys(userPermissions[1].government)).toEqual(['id', 'name']);
            });
        });
    });

    it('retrieveCampaignAdminsAsync', async () => {});
});
