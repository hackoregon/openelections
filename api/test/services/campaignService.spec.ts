import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { createGovernmentAsync } from '../../services/governmentService';
import { Government } from '../../models/entity/Government';
import { createCampaignAsync } from '../../services/campaignService';
import { truncateAll } from '../factories';
import { createUserAsync } from '../../services/userService';
import { User } from '../../models/entity/User';
import { Permission, UserRole } from '../../models/entity/Permission';
import { addPermissionAsync } from '../../services/permissionService';

let governmentRepository: any;
let campaignRepository: any;
let userRepository: any;
let permissionRepository: any;
let government: Government;
let govUser: User;
let campaignAdminUser: User;
let campaignStaffUser: User;

describe('campaignServices', () => {
    before(async () => {
        governmentRepository = getConnection('default').getRepository('Government');
        campaignRepository = getConnection('default').getRepository('Campaign');
        userRepository = getConnection('default').getRepository('User');
        government = await createGovernmentAsync({
            name: 'City of Portland'
        });
        govUser = await createUserAsync({
            firstName: 'Ian',
            lastName: 'Harris',
            password: 'password',
            email: 'ian.harris@hackoregon.org'
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
    });

    beforeEach(async () => {
        await addPermissionAsync({
            userId: govUser.id,
            role: UserRole.GOVERNMENT_ADMIN,
            governmentId: government.id
        });
    });

    after(async () => {
        await truncateAll();
    });

    afterEach(async () => {
        await campaignRepository.query('TRUNCATE "campaign" CASCADE');
    });

    it('Creates a valid campaign if the user is a gov admin', async () => {
        expect(await campaignRepository.count()).equal(0);
        await createCampaignAsync({
            name: 'Melton for Mayor',
            governmentId: government.id,
            currentUserId: govUser.id
        });
        expect(await campaignRepository.count()).equal(1);
    });

    it('Does not create a campaign if government does not exist', async () => {
        expect(await campaignRepository.count()).equal(0);
        try {
            await createCampaignAsync({
                name: 'Melton for Mayor',
                governmentId: 100000,
                currentUserId: govUser.id
            });
        } catch (e) {
            expect(e.message).to.equal('User is not an admin for the provided government');
        }
        expect(await campaignRepository.count()).equal(0);
    });

    it('Does not create a campaign if name is absent', async () => {
        expect(await campaignRepository.count()).equal(0);
        try {
            await createCampaignAsync({
                name: undefined,
                governmentId: government.id,
                currentUserId: govUser.id
            });
        } catch (e) {
            expect(e.message).to.equal('Campaign is not valid');
        }
        expect(await campaignRepository.count()).equal(0);
    });

    it('Does not create a campaign if user is not a gov admin', async () => {
        expect(await campaignRepository.count()).equal(0);
        const campaign = await createCampaignAsync({
            name: 'Melton for Mayor',
            governmentId: government.id,
            currentUserId: govUser.id
        });
        expect(await campaignRepository.count()).equal(1);

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
        try {
            await createCampaignAsync({
                name: 'Melton for Mayor 2',
                governmentId: government.id,
                currentUserId: campaignAdminUser.id
            });
        } catch (e) {
            expect(e.message).to.equal('User is not an admin for the provided government');
        }
        try {
            await createCampaignAsync({
                name: 'Melton for Mayor 3',
                governmentId: government.id,
                currentUserId: campaignStaffUser.id
            });
        } catch (e) {
            expect(e.message).to.equal('User is not an admin for the provided government');
        }
        expect(await campaignRepository.count()).equal(1);
    });
});
