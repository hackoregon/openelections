import { expect } from 'chai';
import { getConnection } from 'typeorm';
import {
    addContributionAsync,
    archiveContributionAsync,
    createContributionCommentAsync,
    getContributionByIdAsync,
    getContributionsAsync,
    getMatchResultAsync,
    IAddContributionAttrs,
    updateContributionAsync,
    updateMatchResultAsync
} from '../../services/contributionService';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../../models/entity/Permission';
import {
    Contribution,
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType,
    MatchStrength
} from '../../models/entity/Contribution';
import {
    newActiveUserAsync,
    newCampaignAsync,
    newContributionAsync,
    newGovernmentAsync,
    truncateAll
} from '../factories';

import { getActivityByContributionAsync } from '../../models/entity/Activity';
import { seedAddresses } from '../../models/seeds/seeds';

let campaignAdmin;
let campaignStaff;
let govAdmin;
let campaign1;
let government;
let indvidualContribution: IAddContributionAttrs;

let contributionRepository: any;

describe('gisService', () => {
    before(async () => {
        contributionRepository = getConnection('default').getRepository('Contribution');
    });

    beforeEach(async () => {
        await seedAddresses();
        [campaignAdmin, campaignStaff, govAdmin, government, campaign1] = await Promise.all([
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
            zip: '97214',
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        };

        await addContributionAsync(indvidualContribution);
        expect(await contributionRepository.count()).equal(1);
    });

});
