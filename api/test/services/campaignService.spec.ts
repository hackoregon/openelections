import { expect } from 'chai';
import * as faker from 'faker';
import { getConnection } from 'typeorm';
import { createGovernmentAsync } from '../../services/governmentService';
import { Government } from '../../models/entity/Government';
import { createCampaignAsync, getCampaignsAsync } from '../../services/campaignService';
import { truncateAll } from '../factories';
import { createUserAsync } from '../../services/userService';
import { User } from '../../models/entity/User';
import { Permission, UserRole } from '../../models/entity/Permission';
import { addPermissionAsync } from '../../services/permissionService';
import { newCampaignAsync } from '../factories';

let governmentRepository: any;
let campaignRepository: any;
let userRepository: any;
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
            currentUserId: govUser.id,
            officeSought: 'Mayor'
        });
        expect(await campaignRepository.count()).equal(1);
    });

    it('Creates a valid campaign and a new user, if current user is a gov admin', async () => {
        expect(await campaignRepository.count()).equal(0);
        const userCount = await userRepository.count();
        await createCampaignAsync({
            name: 'Melton for Mayor',
            governmentId: government.id,
            currentUserId: govUser.id,
            officeSought: 'Mayor',
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email()
        });
        expect(await campaignRepository.count()).equal(1);
        expect(await userRepository.count()).to.equal(userCount + 1)
    });

    it('Creates a valid campaign, but not a new user if fields are missing', async () => {
        expect(await campaignRepository.count()).equal(0);
        const userCount = await userRepository.count();
        await createCampaignAsync({
            name: 'Melton for Mayor',
            officeSought: 'Mayor',
            governmentId: government.id,
            currentUserId: govUser.id,
            email: faker.internet.email()
        });
        expect(await campaignRepository.count()).equal(1);
        expect(await userRepository.count()).to.equal(userCount)
    });

    it('Does not create a campaign if government does not exist', async () => {
        expect(await campaignRepository.count()).equal(0);
        try {
            await createCampaignAsync({
                name: 'Melton for Mayor',
                governmentId: 100000,
                currentUserId: govUser.id,
                officeSought: 'Mayor'
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
                currentUserId: govUser.id,
                officeSought: 'Mayor'
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
            currentUserId: govUser.id,
            officeSought: 'Mayor'
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
                currentUserId: campaignAdminUser.id,
                officeSought: 'Mayor'
            });
        } catch (e) {
            expect(e.message).to.equal('User is not an admin for the provided government');
        }
        try {
            await createCampaignAsync({
                name: 'Melton for Mayor 3',
                governmentId: government.id,
                currentUserId: campaignStaffUser.id,
                officeSought: 'Mayor'
            });
        } catch (e) {
            expect(e.message).to.equal('User is not an admin for the provided government');
        }
        expect(await campaignRepository.count()).equal(1);
    });

    it('Returns campaigns if the user is a government admin', async () => {
        await Promise.all(Array.from(Array(10), (_, i) => government).map(newCampaignAsync));
        expect(
            await getCampaignsAsync({
                governmentId: government.id,
                currentUserId: govUser.id
            })
        )
            .to.be.an.instanceof(Array)
            .that.has.length(10)
            .and.to.have.property(0)
            .that.includes.all.keys(['id', 'name']);
    });

    it('Does not return campaigns if the user is not a government admin', async () => {
        await Promise.all(Array.from(Array(10), (_, i) => government).map(newCampaignAsync));

        let campaigns;
        try {
            campaigns = await getCampaignsAsync({
                governmentId: government.id,
                currentUserId: campaignAdminUser.id
            });
        } catch (e) {
            expect(e.message).to.equal('User is not an admin for the provided government');
        }
        expect(campaigns).to.be.an('undefined');

        try {
            campaigns = await getCampaignsAsync({
                governmentId: government.id,
                currentUserId: undefined
            });
        } catch (e) {
            expect(e.message).to.equal('User is not an admin for the provided government');
        }
        expect(campaigns).to.be.an('undefined');
    });
});
