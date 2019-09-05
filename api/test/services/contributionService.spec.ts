import {expect} from 'chai';
import {getConnection} from 'typeorm';
import {
    addContributionAsync,
    archiveContributionAsync,
    createContributionCommentAsync,
    getContributionByIdAsync,
    getContributionsAsync,
    getMatchResultAsync,
    IAddContributionAttrs,
    retrieveAndSaveMatchResultAsync,
    updateContributionAsync,
    updateMatchResultAsync
} from '../../services/contributionService';
import {addPermissionAsync} from '../../services/permissionService';
import {UserRole} from '../../models/entity/Permission';
import {
    Contribution,
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType,
    MatchStrength,
    PaymentMethod
} from '../../models/entity/Contribution';
import {
    newActiveUserAsync,
    newCampaignAsync,
    newContributionAsync,
    newGovernmentAsync,
    truncateAll
} from '../factories';

import {getActivityByContributionAsync} from '../../models/entity/Activity';
import {addGISBoundaries, seedAddresses} from '../../models/seeds/seeds';

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
    before(async () => {
        contributionRepository = getConnection('default').getRepository('Contribution');
    });

    beforeEach(async () => {
        await seedAddresses();
        addGISBoundaries();
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
            zip: '97214',
            contributorType: ContributorType.INDIVIDUAL,
            paymentMethod: PaymentMethod.CASH,
            date: Date.now()
        };

        await addContributionAsync(indvidualContribution);
        expect(await contributionRepository.count()).equal(1);
    });

    it('Creates an activity record when adding a contribution', async () => {
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
            paymentMethod: PaymentMethod.CASH,
            date: Date.now()
        };

        const contribution = await addContributionAsync(indvidualContribution);
        const activity = await getActivityByContributionAsync(contribution.id, 100, 0);

        expect(await contributionRepository.count()).equal(1);
        expect(activity).to.have.length(1);
        expect(activity[0].notes).to.include(`added a contribution (${contribution.id}).`);
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
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                paymentMethod: PaymentMethod.CASH,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                contributorType: ContributorType.INDIVIDUAL
            };

            await addContributionAsync(invalidIndvidualContribution as IAddContributionAttrs);
        } catch (e) {
            expect(e.message);
        }
        expect(await contributionRepository.count()).equal(0);
    });

    it('Gets all contribution for a government without specifying options as gov admin', async () => {
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
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                paymentMethod: PaymentMethod.CASH,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
            })
        ]);
        expect(
            (await getContributionsAsync({ governmentId: government.id, currentUserId: govAdmin.id })).length
        ).to.equal(2);
    });

    it('Gets all contributions for a matchId as govAdmin', async () => {
        let contribution = await addContributionAsync({
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
            paymentMethod: PaymentMethod.CASH,
            subType: ContributionSubType.CASH,
            state: 'OR',
            zip: '97214',
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });
        contributionRepository.update(contribution.id, {matchId: 1});
        contribution = await addContributionAsync({
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
            });
          contributionRepository.update(contribution.id, {matchId: 2});
        expect(
            (await getContributionsAsync({ governmentId: government.id, currentUserId: govAdmin.id, matchId: 1 })).length
        ).to.equal(1);
    });

    it('Gets all contributions for a matchId as campaign', async () => {
        try {
            await getContributionsAsync({ governmentId: government.id, currentUserId: campaignAdmin.id, matchId: 1 });
        } catch (e) {
            expect(e.message).to.equal('User is not permitted to get contributions by matchId.');
        }
    });

    it('Throw an error getting all contributions for a government as a non gov admin', async () => {
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
                paymentMethod: PaymentMethod.CASH,
                subType: ContributionSubType.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
            })
        ]);
        try {
            await getContributionsAsync({ governmentId: government.id, currentUserId: govAdmin.id });
        } catch (e) {
            expect(e.message);
        }
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
                paymentMethod: PaymentMethod.CASH,
                subType: ContributionSubType.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                subType: ContributionSubType.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
            })
        ]);

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                currentUserId: govAdmin.id,
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
                paymentMethod: PaymentMethod.CASH,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
            })
        ]);

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                currentUserId: govAdmin.id,
                to: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
            })).length
        ).to.equal(0);

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                currentUserId: govAdmin.id,
                from: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
                to: new Date().toISOString()
            })).length
        ).to.equal(2);
    });

    it('Gets a contribution for a government specifying status option', async () => {
        const [contr1, contr2, contr3] = await Promise.all([
            addContributionAsync({
                address1: '123 ABC ST',
                amount: 250,
                campaignId: campaign2.id,
                city: 'Portland',
                currentUserId: campaignStaff.id,
                firstName: 'John',
                paymentMethod: PaymentMethod.CASH,
                middleInitial: '',
                lastName: 'Doe',
                governmentId: government.id,
                type: ContributionType.CONTRIBUTION,
                subType: ContributionSubType.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
            })
        ]);

        contributionRepository.update(contr3.id, { status: ContributionStatus.SUBMITTED});

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                currentUserId: govAdmin.id,
                status: ContributionStatus.DRAFT
            })).length
        ).to.equal(2);
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
            })
        ]);

        const contributions = await getContributionsAsync({
            governmentId: government.id,
            campaignId: campaign2.id,
            currentUserId: campaignStaff.id,
            page: 0,
            perPage: 10,
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
            })
        ]);

        expect(
            (await getContributionsAsync({
                governmentId: government.id,
                campaignId: campaign2.id,
                currentUserId: govAdmin.id,
                page: 0,
                perPage: 10,
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
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
                paymentMethod: PaymentMethod.CASH,
                state: 'OR',
                zip: '97214',
                contributorType: ContributorType.INDIVIDUAL,
                date: Date.now()
            })
        ]);

        try {
            await getContributionsAsync({
                governmentId: government.id,
                campaignId: campaign2.id,
                currentUserId: campaignStaff.id,
                page: 0,
                perPage: 10,
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
            amount: 1500,
            zip: '98101'
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

    it('updateContributionAsync creates activity record ', async () => {
        let contribution = await newContributionAsync(campaign2, government);
        const { zip: originalZip, amount: originalAmount } = contribution;
        await updateContributionAsync({
            currentUserId: campaignStaff.id,
            id: contribution.id,
            amount: 1500,
            zip: '98101'
        });
        contribution = await contributionRepository.findOne(contribution.id);
        const activity = await getActivityByContributionAsync(contribution.id, 10, 0);
        expect(contribution.amount).to.equal(1500);
        expect(contribution.zip).to.equal('98101');
        expect(activity).to.have.length(1);
        expect(activity[0].notes).to.include('amount changed');
        expect(activity[0].notes).to.include('zip changed');
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
            expect(error.message).to.equal('User does not have permissions');
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
            expect(error.message).to.equal('User does not have permissions');
        }
    });

    it('gets a contribution by id as gov admin', async () => {
        const contribution = await newContributionAsync(campaign2, government);
        const c = await getContributionByIdAsync({
            contributionId: contribution.id,
            currentUserId: govAdmin.id
        });
        expect(c.id === contribution.id);
    });

    it('gets a contribution by id as campaign staff', async () => {
        const contribution = await newContributionAsync(campaign2, government);
        const c = await getContributionByIdAsync({
            contributionId: contribution.id,
            currentUserId: campaignStaff.id
        });
        expect(c.id === contribution.id);
    });

    it('gets a contribution by id fails without campaign id as campaign staff', async () => {
        try {
            const contribution = await newContributionAsync(campaign2, government);
            await getContributionByIdAsync({
                contributionId: contribution.id,
                currentUserId: campaignStaff.id
            });
        } catch (err) {
            expect(err.message).to.equal('Must be a government admin to query all contributions');
        }
    });

    it('gets a contribution by id fails with wrong campaign id as campaign staff', async () => {
        try {
            const contribution = await newContributionAsync(campaign2, government);
            await getContributionByIdAsync({
                contributionId: contribution.id,
                currentUserId: campaignStaff.id
            });
        } catch (err) {
            expect(err.message).to.equal('User is not permitted to get contributions for this campaign');
        }
    });

    it('archiveContributionAsync success if draft, campaign staff', async () => {
        const contribution = await newContributionAsync(campaign2, government);
        expect(contribution.status).to.equal(ContributionStatus.DRAFT);
        await archiveContributionAsync({ currentUserId: campaignStaff.id, contributionId: contribution.id });
        const updated = (await contributionRepository.findOne(contribution.id)) as Contribution;
        expect(updated.status).to.equal(ContributionStatus.ARCHIVED);
    });

    it('archiveContributionAsync success if draft, government staff', async () => {
        const contribution = await newContributionAsync(campaign2, government);
        expect(contribution.status).to.equal(ContributionStatus.DRAFT);
        await archiveContributionAsync({ currentUserId: govAdmin.id, contributionId: contribution.id });
        const updated = (await contributionRepository.findOne(contribution.id)) as Contribution;
        expect(updated.status).to.equal(ContributionStatus.ARCHIVED);
    });

    it('archiveContributionAsync success if draft, campaign admin staff', async () => {
        const contribution = await newContributionAsync(campaign2, government);
        expect(contribution.status).to.equal(ContributionStatus.DRAFT);
        await archiveContributionAsync({ currentUserId: govAdmin.id, contributionId: contribution.id });
        const updated = (await contributionRepository.findOne(contribution.id)) as Contribution;
        expect(updated.status).to.equal(ContributionStatus.ARCHIVED);
    });

    it('archiveContributionAsync creates an activity record', async () => {
        const contribution = await newContributionAsync(campaign2, government);
        expect(contribution.status).to.equal(ContributionStatus.DRAFT);
        await archiveContributionAsync({ currentUserId: govAdmin.id, contributionId: contribution.id });
        const updated = (await contributionRepository.findOne(contribution.id)) as Contribution;
        expect(updated.status).to.equal(ContributionStatus.ARCHIVED);

        const activity = await getActivityByContributionAsync(contribution.id, 100, 0);
        expect(activity).to.have.length(1);
        expect(activity[0].notes).to.include(`archived contribution ${contribution.id}.`);
    });

    it('archiveContributionAsync fails if processed', async () => {
        let contribution = await newContributionAsync(campaign2, government);
        contribution.status = ContributionStatus.PROCESSED;
        await contributionRepository.save(contribution);
        contribution = (await contributionRepository.findOne(contribution.id)) as Contribution;
        expect(contribution.status).to.equal(ContributionStatus.PROCESSED);
        try {
            await archiveContributionAsync({ currentUserId: govAdmin.id, contributionId: contribution.id });
        } catch (error) {
            expect(error.message).to.equal('Contribution must have status of Draft to be Archived');
        }
        const notUpdated = (await contributionRepository.findOne(contribution.id)) as Contribution;
        expect(notUpdated.status).to.equal(ContributionStatus.PROCESSED);
    });

    it('archiveContributionAsync fails if submitted', async () => {
        let contribution = await newContributionAsync(campaign2, government);
        contribution.status = ContributionStatus.SUBMITTED;
        await contributionRepository.save(contribution);
        contribution = (await contributionRepository.findOne(contribution.id)) as Contribution;
        expect(contribution.status).to.equal(ContributionStatus.SUBMITTED);
        try {
            await archiveContributionAsync({ currentUserId: govAdmin.id, contributionId: contribution.id });
        } catch (error) {
            expect(error.message).to.equal('Contribution must have status of Draft to be Archived');
        }
        const notUpdated = (await contributionRepository.findOne(contribution.id)) as Contribution;
        expect(notUpdated.status).to.equal(ContributionStatus.SUBMITTED);
    });

    it('createContributionCommentAsync fails no user permission', async () => {
        const contribution = await newContributionAsync(campaign2, government);
        let activities = await getActivityByContributionAsync(contribution.id, 100, 0);
        expect(activities.length).to.equal(0);
        const user = await newActiveUserAsync();
        try {
            await createContributionCommentAsync({
                contributionId: contribution.id,
                currentUserId: user.id,
                comment: 'This is a comment'
            });
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions');
        }
        activities = await getActivityByContributionAsync(contribution.id, 100, 0);
        expect(activities.length).to.equal(0);
    });

    it('createContributionCommentAsync fails cant find conrtibution', async () => {
        let activities = await getActivityByContributionAsync(1000, 100, 0);
        expect(activities.length).to.equal(0);
        const user = await newActiveUserAsync();
        try {
            await createContributionCommentAsync({
                contributionId: 1000,
                currentUserId: user.id,
                comment: 'This is a comment'
            });
        } catch (e) {
            expect(e.message).to.equal('Could not find any entity of type "Contribution" matching: 1000');
        }
        activities = await getActivityByContributionAsync(1000, 100, 0);
        expect(activities.length).to.equal(0);
    });


    it('getActivityByContributionAsync success', async () => {
        const contribution = await newContributionAsync(campaign1, government);
        let activities = await getActivityByContributionAsync(contribution.id, 100, 0);
        expect(activities.length).to.equal(0);
        await createContributionCommentAsync({
            contributionId: contribution.id,
            currentUserId: campaignAdmin.id,
            comment: 'This is a comment'
        });
        activities = await getActivityByContributionAsync(contribution.id, 100, 0);
        expect(activities.length).to.equal(1);
    });

    it('retrieveAndSaveMatchResultAsync exact', async () => {
        let contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debbie',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        await contributionRepository.update(contribution.id, { addressPoint: {
                type: 'Point',
                coordinates: [-122.676483, 45.523064]
            }});

        await retrieveAndSaveMatchResultAsync(contribution.id);

        contribution = await contributionRepository.findOne(contribution.id);


        expect(contribution.matchStrength).to.equal(MatchStrength.EXACT);
        expect(contribution.matchId).to.not.be.null;
        expect(contribution.matchResult).to.not.be.null;
        expect(contribution.matchResult.exact.length).to.equal(1);
        expect(contribution.matchResult.strong.length).to.equal(0);
        expect(contribution.matchResult.weak.length).to.equal(0);
    });

    it('retrieveAndSaveMatchResultAsync strong', async () => {
        let contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debb',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        await contributionRepository.update(contribution.id, { addressPoint: {
                type: 'Point',
                coordinates: [-122.676483, 45.523064]
            }});

        await retrieveAndSaveMatchResultAsync(contribution.id);

        contribution = await contributionRepository.findOne(contribution.id);

        expect(contribution.matchStrength).to.equal(MatchStrength.STRONG);
        expect(contribution.matchId).to.be.null;
        expect(contribution.matchResult).to.not.be.null;
        expect(contribution.matchResult.exact.length).to.equal(0);
        expect(contribution.matchResult.strong.length).to.equal(1);
        expect(contribution.matchResult.weak.length).to.equal(0);
    });

    it('retrieveAndSaveMatchResultAsync weak', async () => {
        let contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'daniel',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });


        await contributionRepository.update(contribution.id, { addressPoint: {
                type: 'Point',
                coordinates: [-122.676483, 45.523064]
            }});

        await retrieveAndSaveMatchResultAsync(contribution.id);

        contribution = await contributionRepository.findOne(contribution.id);

        expect(contribution.matchStrength).to.equal(MatchStrength.WEAK);
        expect(contribution.matchId).to.be.null;
        expect(contribution.matchResult).to.not.be.null;
        expect(contribution.matchResult.exact.length).to.equal(0);
        expect(contribution.matchResult.strong.length).to.equal(0);
        expect(contribution.matchResult.weak.length).to.equal(1);
    });

    it('retrieveAndSaveMatchResultAsync none', async () => {
        let contribution = await addContributionAsync({
            lastName: 'smith',
            firstName: 'john',
            address1: '10 Main',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });
        await contributionRepository.update(contribution.id, { addressPoint: {
                type: 'Point',
                coordinates: [-122.676483, 45.523064]
            }});

        await retrieveAndSaveMatchResultAsync(contribution.id);

        contribution = await contributionRepository.findOne(contribution.id);

        expect(contribution.matchStrength).to.equal(MatchStrength.NONE);
        expect(contribution.matchId).to.be.not.null;
        expect(contribution.matchResult).to.not.be.null;
        expect(contribution.matchResult.exact.length).to.equal(0);
        expect(contribution.matchResult.strong.length).to.equal(0);
        expect(contribution.matchResult.weak.length).to.equal(0);
    });

    it('updateMatchResultAsync exact match not allow', async () => {
        let contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debbie',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        contribution = await contributionRepository.findOne(contribution.id);

        try {
            await updateMatchResultAsync({contributionId: contribution.id, currentUserId: govAdmin.id, matchStrength: MatchStrength.NONE, matchId: 'love'});
        } catch (e) {
            expect(e.message).to.equal('Contribution has an exact match, cannot update');
        }
    });

    it('updateMatchResultAsync no permissions', async () => {
        const contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debb',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        await contributionRepository.update(contribution.id, { addressPoint: {
                type: 'Point',
                coordinates: [-122.676483, 45.523064]
            }});

        try {
            await updateMatchResultAsync({contributionId: contribution.id, currentUserId: campaignAdmin.id, matchStrength: MatchStrength.NONE, matchId: 'love'});
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions');
        }
    });

    it('updateMatchResultAsync contribution not found', async () => {
        try {
            await updateMatchResultAsync({contributionId: 10000, currentUserId: campaignAdmin.id, matchStrength: MatchStrength.NONE, matchId: 'love'});
        } catch (e) {
            expect(e.message).to.equal('Could not find any entity of type "Contribution" matching: 10000');
        }
    });

    it('updateMatchResultAsync success', async () => {
        let contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'daniel',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        await contributionRepository.update(contribution.id, { addressPoint: {
                type: 'Point',
                coordinates: [-122.676483, 45.523064]
            }});

        await updateMatchResultAsync({contributionId: contribution.id, currentUserId: govAdmin.id, matchStrength: MatchStrength.WEAK, matchId: 'love'});
        contribution = await contributionRepository.findOne(contribution.id);
        expect(contribution.matchStrength).to.equal(MatchStrength.WEAK);
        expect(contribution.matchId).to.equal('love');
    });

    it('getMatchResultAsync no permissions', async () => {
        const contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debb',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        await contributionRepository.update(contribution.id, { addressPoint: {
                type: 'Point',
                coordinates: [-122.676483, 45.523064]
            }});

        try {
            await getMatchResultAsync({contributionId: contribution.id, currentUserId: campaignAdmin.id});
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions');
        }
    });

    it('getMatchResultAsync contribution not found', async () => {
        try {
            await getMatchResultAsync({contributionId: 10000, currentUserId: govAdmin.id});
        } catch (e) {
            expect(e.message).to.equal('Could not find any entity of type "Contribution" matching: 10000');
        }
    });

    it('getMatchResultAsync success', async () => {
        const contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debbie',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            paymentMethod: PaymentMethod.CASH,
            subType: ContributionSubType.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });
        const result = await getMatchResultAsync({contributionId: contribution.id, currentUserId: govAdmin.id});
        expect(result.matchStrength).to.equal(MatchStrength.EXACT);
        expect(result.results.exact.length).to.equal(1);
        expect(result.results.strong.length).to.equal(0);
        expect(result.results.weak.length).to.equal(0);
        expect(result.results.none).to.not.be.undefined;
    });

    it('updateContributionAsync user permissions for updating fields when submitted status', async () => {
        let contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debbie',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        contribution.status = ContributionStatus.SUBMITTED;
        contributionRepository.save(contribution);

        try {
            await updateContributionAsync({
                currentUserId: campaignStaff.id,
                id: contribution.id,
                amount: 150
            });
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions');
        }

        try {
            await updateContributionAsync({
                currentUserId: campaignAdmin.id,
                id: contribution.id,
                status: ContributionStatus.PROCESSED
            });
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions to change status to processed');
        }

        await updateContributionAsync({
            currentUserId: govAdmin.id,
            id: contribution.id,
            status: ContributionStatus.PROCESSED
        });

        contribution = await contributionRepository.findOne(contribution.id);

        expect(contribution.status).to.equal(ContributionStatus.PROCESSED);

    });

    it('updateContributionAsync user permissions for status change to processed', async () => {
        let contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debbie',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        contribution.status = ContributionStatus.PROCESSED;
        contributionRepository.save(contribution);

        try {
            await updateContributionAsync({
                currentUserId: govAdmin.id,
                id: contribution.id,
                matchAmount: 250
            });
        } catch (e) {
            expect(e.message).to.equal('Cannot change attributes on a processed contribution');
        }

        contribution = await contributionRepository.findOne(contribution.id);

        expect(contribution.status).to.equal(ContributionStatus.PROCESSED);

    });

    it('updateContributionAsync user permissions for status change to processed', async () => {
        let contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debbie',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 250,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        try {
            await updateContributionAsync({
                currentUserId: campaignStaff.id,
                id: contribution.id,
                status: ContributionStatus.PROCESSED
            });
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions to change status to processed');
        }

        try {
            await updateContributionAsync({
                currentUserId: campaignAdmin.id,
                id: contribution.id,
                status: ContributionStatus.PROCESSED
            });
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions to change status to processed');
        }

        await updateContributionAsync({
            currentUserId: govAdmin.id,
            id: contribution.id,
            status: ContributionStatus.PROCESSED
        });

        contribution = await contributionRepository.findOne(contribution.id);

        expect(contribution.status).to.equal(ContributionStatus.PROCESSED);

    });

    it('updateContributionAsync user permissions for matchAmount', async () => {
        let contribution = await addContributionAsync({
            lastName: 'daniel',
            firstName: 'debbie',
            address1: '1024 SE Morrison',
            zip: '97214',
            city: 'Portland',
            state: 'OR',
            amount: 50,
            campaignId: campaign1.id,
            currentUserId: campaignAdmin.id,
            governmentId: government.id,
            type: ContributionType.CONTRIBUTION,
            subType: ContributionSubType.CASH,
            paymentMethod: PaymentMethod.CASH,
            contributorType: ContributorType.INDIVIDUAL,
            date: Date.now()
        });

        try {
            await updateContributionAsync({
                currentUserId: campaignStaff.id,
                id: contribution.id,
                matchAmount: 50
            });
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions to change matchAmount');
        }

        try {
            await updateContributionAsync({
                currentUserId: campaignAdmin.id,
                id: contribution.id,
                matchAmount: 50
            });
        } catch (e) {
            expect(e.message).to.equal('User does not have permissions to change matchAmount');
        }

        await updateContributionAsync({
            currentUserId: govAdmin.id,
            id: contribution.id,
            matchAmount: 50
        });

        contribution = await contributionRepository.findOne(contribution.id);

        expect(contribution.matchAmount).to.equal(50);

    });

});
