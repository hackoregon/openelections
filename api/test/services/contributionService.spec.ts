import { expect } from 'chai';
import { getConnection } from 'typeorm';
import {
    addContributionAsync,
    IAddContributionAttrs,
    getContributionsAsync, updateContributionAsync,
} from '../../services/contributionService';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../../models/entity/Permission';
import {
    ContributionSubType,
    ContributionType,
    ContributorType,
    ContributionStatus
} from '../../models/entity/Contribution';
import {
    newActiveUserAsync,
    newCampaignAsync,
    newContributionAsync,
    newGovernmentAsync,
    truncateAll
} from '../factories';

let campaignAdmin;
let campaignStaff;
let govAdmin;
let campaign1;
let campaign2;
let government;
let indvidualContribution: IAddContributionAttrs;
let invalidIndvidualContribution;

let contributionRepository: any;

describe('contributionService', () => {
    before(() => {
        contributionRepository = getConnection('default').getRepository('Contribution');
    });

    beforeEach(async () => {
        [campaignAdmin, campaignStaff, govAdmin, government, campaign1, campaign2] = await Promise.all([
            newActiveUserAsync(),
            newActiveUserAsync(),
            newActiveUserAsync(),
            newGovernmentAsync(),
            newCampaignAsync(),
            newCampaignAsync()
        ]);

        await Promise.all([
            addPermissionAsync({
                userId: campaignAdmin.id,
                governmentId: government.id,
                campaignId: campaign1.id,
                role: UserRole.CAMPAIGN_ADMIN
            }),
            addPermissionAsync({
                userId: campaignStaff.id,
                governmentId: government.id,
                campaignId: campaign2.id,
                role: UserRole.CAMPAIGN_STAFF
            }),
            addPermissionAsync({
                userId: govAdmin.id,
                governmentId: government.id,
                role: UserRole.GOVERNMENT_ADMIN
            })
        ]);
    });

    afterEach(async () => {
        await truncateAll();
    });

    it('Adds a valid contribution for a campaign', async () => {
        expect(await contributionRepository.count()).equal(0);

        indvidualContribution = {
            address1: '123 ABC ST',
            amount: 250,
            campaignId: campaign2.id,
            city: 'Portland',
            currentUserId: campaignStaff.id,
            firstName: 'John',
            middleInitial: '',
            lastName: 'Doe',
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            state: 'OR',
            status: ContributionStatus.DRAFT,
            zip: '97214',
            contributorType: ContributorType.INDIVIDUAL
        };

        await addContributionAsync(indvidualContribution);
        expect(await contributionRepository.count()).equal(1);
    });

    it('Does not add a contribution if the user does not belong to the campaign', async () => {
        try {
            expect(await contributionRepository.count()).equal(0);

            indvidualContribution = {
                address1: '123 ABC ST',
                amount: 250,
                campaignId: campaign1.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            };

            await addContributionAsync(indvidualContribution);
        } catch (e) {
            expect(e.message).to.equal('User is not permitted to add contributions for this campaign.');
        }
        expect(await contributionRepository.count()).equal(0);
    });

    it('Does not add an invalid contribution', async () => {
        try {
            expect(await contributionRepository.count()).equal(0);

            invalidIndvidualContribution = {
                address1: '123 ABC ST',
                amount: 1000000,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: 'Bullion',
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            };

            await addContributionAsync(invalidIndvidualContribution as IAddContributionAttrs);
        } catch (e) {
            expect(e.message);
        }
        expect(await contributionRepository.count()).equal(0);
    });

    it('Gets a contribution for a government without specifying options', async () => {
        await Promise.all([
            addContributionAsync({
                address1: '123 ABC ST',
                amount: 250,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            }),
            addContributionAsync({
                address1: '456 ABC ST',
                amount: 100,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            })
        ]);
        expect((await getContributionsAsync({ governmentId: government.id })).length).to.equal(2);
    });

    it('Gets a contribution for a government specifying page options', async () => {
        await Promise.all([
            addContributionAsync({
                address1: '123 ABC ST',
                amount: 250,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            }),
            addContributionAsync({
                address1: '456 ABC ST',
                amount: 100,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            })
        ]);

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                page: 0,
                perPage: 1
            })).length
        ).to.equal(1);
    });

    it('Gets a contribution for a government specifying date options', async () => {
        await Promise.all([
            addContributionAsync({
                address1: '123 ABC ST',
                amount: 250,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            }),
            addContributionAsync({
                address1: '456 ABC ST',
                amount: 100,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            })
        ]);

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                to: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
            })).length
        ).to.equal(0);

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                from: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
                to: new Date().toISOString()
            })).length
        ).to.equal(2);
    });

    it('Gets a contribution for a government specifying status option', async () => {
        await Promise.all([
            addContributionAsync({
                address1: '123 ABC ST',
                amount: 250,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            }),
            addContributionAsync({
                address1: '456 ABC ST',
                amount: 100,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            }),
            addContributionAsync({
                address1: '456 ABC ST',
                amount: 100,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.SUBMITTED,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            })
        ]);

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                status: ContributionStatus.SUBMITTED
            })).length
        ).to.equal(1);
    });

    it('Gets contributions for a campaign specifying all options', async () => {
        await Promise.all([
            addContributionAsync({
                address1: '123 ABC ST',
                amount: 250,
                campaignId: campaign1.id,
                city: 'Portland',
                currentUserId: campaignAdmin.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            }),
            addContributionAsync({
                address1: '456 ABC ST',
                amount: 100,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            })
        ]);

        const contributions = await getContributionsAsync({
            governmentId: government.id,
            campaignId: campaign2.id,
            currentUserId: campaignStaff.id,
            page: 0,
            perPage: 10,
            status: ContributionStatus.DRAFT,
            from: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
            to: new Date().toISOString()
        });
        expect(contributions.length).to.equal(1);
    });

    it('Gets contributions for a campaign as gov admin', async () => {
        await Promise.all([
            addContributionAsync({
                address1: '123 ABC ST',
                amount: 250,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            }),
            addContributionAsync({
                address1: '456 ABC ST',
                amount: 100,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            })
        ]);

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                campaignId: campaign2.id,
                currentUserId: govAdmin.id,
                page: 0,
                perPage: 10,
                status: ContributionStatus.DRAFT,
                from: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
                to: new Date().toISOString()
            })).length
        ).to.equal(2);
    });

    it('Does not get a contribution if user does not belong to campaign or is not a gov admin', async () => {
        await Promise.all([
            addContributionAsync({
                address1: '123 ABC ST',
                amount: 250,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            }),
            addContributionAsync({
                address1: '456 ABC ST',
                amount: 100,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                status: ContributionStatus.DRAFT,
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL
            })
        ]);

        try {
            await getContributionsAsync({
                governmentId: government.id,
                campaignId: campaign2.id,
                currentUserId: campaignStaff.id,
                page: 0,
                perPage: 10,
                status: ContributionStatus.DRAFT,
                from: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
                to: new Date().toISOString()
            });
        } catch (e) {
            expect(e.message);
        }
    });

    it('updateContributionAsync campaignStaff ', async () => {
        let contribution = await newContributionAsync(campaign2, government);
        await updateContributionAsync({
            currentUserId: campaignStaff.id,
            id: contribution.id,
            amount: 1500
        });
        contribution = await contributionRepository.findOne(contribution.id);
        expect(contribution.amount).to.equal(1500);
    });

    it('updateContributionAsync campaignAdmin ', async () => {
        let contribution = await newContributionAsync(campaign1, government);
        await updateContributionAsync({
            currentUserId: campaignAdmin.id,
            id: contribution.id,
            amount: 1550
        });
        contribution = await contributionRepository.findOne(contribution.id);
        expect(contribution.amount).to.equal(1550);
    });

    it('updateContributionAsync governmentAdmin', async () => {
        let contribution = await newContributionAsync(campaign1, government);
        await updateContributionAsync({
            currentUserId: govAdmin.id,
            id: contribution.id,
            amount: 150
        });
        contribution = await contributionRepository.findOne(contribution.id);
        expect(contribution.amount).to.equal(150);
    });

    it('updateContributionAsync campaignStaff different campaign fails', async () => {
        try {
            let contribution = await newContributionAsync(campaign1, government);
            await updateContributionAsync({
                currentUserId: campaignStaff.id,
                id: contribution.id,
                amount: 1500
            });
            contribution = await contributionRepository.findOne(contribution.id);
            expect(contribution.amount).to.equal(1500);
        } catch (error) {
            expect(error.message).to.equal('User does not have permissions')
        }
    });

    it('updateContributionAsync campaignAdmin different campaign fails', async () => {
        try {
            let contribution = await newContributionAsync(campaign2, government);
            await updateContributionAsync({
                currentUserId: campaignAdmin.id,
                id: contribution.id,
                amount: 1550
            });
            contribution = await contributionRepository.findOne(contribution.id);
            expect(contribution.amount).to.equal(1550);
        } catch (error) {
            expect(error.message).to.equal('User does not have permissions')
        }
    });
});
