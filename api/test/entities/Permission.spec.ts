import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Campaign } from '../../models/entity/Campaign';
import { Government } from '../../models/entity/Government';
import { User } from '../../models/entity/User';
import { Permission, UserRole } from '../../models/entity/Permission';
import { createUserAsync } from '../../services/userService';


let permissionRepository: any;
let campaignRepository: any;
let governmentRepository: any;
let userRepository: any;
let government: Government;
let campaign: Campaign;
let user: User;

describe('Permission', () => {
    before(async () => {
        user = await createUserAsync({firstName: 'Dan', lastName: 'Melton', password: 'password', email: 'dan@civicsoftwarefoundation.org'});
        campaignRepository = getConnection('default').getRepository('Campaign');
        governmentRepository = getConnection('default').getRepository('Government');
        permissionRepository = getConnection('default').getRepository('Permission');
        userRepository = getConnection('default').getRepository('User');
        government = new Government();
        government.name = 'City of Portland';
        await governmentRepository.save(government);
        campaign = new Campaign();
        campaign.name = 'Melton for Mayor';
        campaign.government = government;
        await campaignRepository.save(campaign);
    });

    afterEach(async () => {
        await permissionRepository.query('TRUNCATE "permission" CASCADE');
    });

    after(async () => {
        await governmentRepository.query('TRUNCATE "government" CASCADE');
        await campaignRepository.query('TRUNCATE "campaign" CASCADE');
        await userRepository.query('TRUNCATE "user" CASCADE');
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
});
