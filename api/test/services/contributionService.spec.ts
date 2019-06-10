import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { addContributionAsync, IAddContributionAttrs } from '../../services/contributionService';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../../models/entity/Permission';
import {
    ContributionSubType,
    ContributionType,
    ContributorType,
    ContributionStatus
} from '../../models/entity/Contribution';
import { newActiveUserAsync, newCampaignAsync, newGovernmentAsync, truncateAll } from '../factories';

let campaignAdmin;
let campaignStaff;
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
        [campaignAdmin, campaignStaff, government, campaign1, campaign2] = await Promise.all([
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
});
