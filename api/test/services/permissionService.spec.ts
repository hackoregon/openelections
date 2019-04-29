import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Campaign } from '../../models/entity/Campaign';
import { Government } from '../../models/entity/Government';
import { User } from '../../models/entity/User';
import { Permission, UserRole } from '../../models/entity/Permission';
import { createUserAsync } from '../../services/userService';
import {
    addPermissionAsync,
    isCampaignAdminAsync,
    isCampaignStaffAsync,
    isGovernmentAdminAsync, removePermissionAsync
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

describe('Permission', () => {
    before(async () => {
        govUser = await createUserAsync({firstName: 'Dan', lastName: 'Melton', password: 'password', email: 'dan@civicsoftwarefoundation.org'});
        campaignAdminUser = await createUserAsync({firstName: 'Jane', lastName: 'Doe', password: 'password', email: 'jane@civicsoftwarefoundation.org'});
        campaignStaffUser = await createUserAsync({firstName: 'John', lastName: 'Doe', password: 'password', email: 'john@civicsoftwarefoundation.org'});
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

    afterEach(async () => {
        await permissionRepository.query('TRUNCATE "permission" CASCADE');
    });

    after(async () => {
        await governmentRepository.query('TRUNCATE "government" CASCADE');
        await campaignRepository.query('TRUNCATE "campaign" CASCADE');
        await userRepository.query('TRUNCATE "user" CASCADE');
    });

    describe('permissionChecks', () => {
        beforeEach(async () => {
            await addPermissionAsync(govUser.id, UserRole.GOVERNMENT_ADMIN, undefined, government.id);
            await addPermissionAsync(campaignAdminUser.id, UserRole.CAMPAIGN_ADMIN, campaign.id);
            await addPermissionAsync(campaignStaffUser.id, UserRole.CAMPAIGN_STAFF, campaign.id);
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
                    await addPermissionAsync(1100, UserRole.CAMPAIGN_ADMIN, campaign.id);
                } catch (e) {
                    expect(e.message).to.equal('Could not find any entity of type "User" matching: 1100');
                }
            });

            it('no campaign found', async () => {
                try {
                    await addPermissionAsync(campaignStaffUser.id, UserRole.CAMPAIGN_ADMIN, 1100);
                } catch (e) {
                    expect(e.message).to.equal('Could not find any entity of type "Campaign" matching: 1100');
                }
            });

            it('no gov found', async () => {
                try {
                    await addPermissionAsync(campaignStaffUser.id, UserRole.CAMPAIGN_ADMIN, undefined, 1100);
                } catch (e) {
                    expect(e.message).to.equal('Could not find any entity of type "Government" matching: 1100');
                }
            });
        });

        context('succeeds', () => {
            it('adding gov admin', async () => {
                expect(await permissionRepository.count()).equal(0);
                await addPermissionAsync(govUser.id, UserRole.GOVERNMENT_ADMIN, undefined, government.id);
                expect(await permissionRepository.count()).equal(1);
            });

            it('adding campaign admin', async () => {
                expect(await permissionRepository.count()).equal(0);
                await addPermissionAsync(campaignAdminUser.id, UserRole.CAMPAIGN_ADMIN, campaign.id);
                expect(await permissionRepository.count()).equal(1);
            });

            it('adding campaign staff', async () => {
                expect(await permissionRepository.count()).equal(0);
                await addPermissionAsync(campaignStaffUser.id, UserRole.CAMPAIGN_STAFF, campaign.id);
                expect(await permissionRepository.count()).equal(1);
            });
        });
    });

    context('removePermissionsAsync', () => {
        it('fails id not found', async () => {
            expect(await removePermissionAsync(1100)).to.be.false;
        });

        it('succeeds', async () => {
            expect(await permissionRepository.count()).equal(0);
            const permission = await addPermissionAsync(govUser.id, UserRole.GOVERNMENT_ADMIN, undefined, government.id);
            expect(await permissionRepository.count()).equal(1);
            expect(await removePermissionAsync(permission.id)).to.be.true;
            expect(await permissionRepository.count()).equal(0);
        });
    });
});
