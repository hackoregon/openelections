import { faker } from '@faker-js/faker';
import { User, UserStatus } from '../models/entity/User';
import { Government } from '../models/entity/Government';
import { Campaign } from '../models/entity/Campaign';
import {
    Contribution,
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType,
    IContributionSummary,
    IContributionSummaryResults,
} from '../models/entity/Contribution';
import {
    Expenditure,
    ExpenditureStatus,
    ExpenditureSubType,
    ExpenditureType,
    PayeeType,
    PaymentMethod,
    PurposeType,
    IExpenditureSummaryResults,
    IExpenditureSummary,
} from '../models/entity/Expenditure';
import { ExternalContribution, ExternalContributionSubType } from '../models/entity/ExternalContribution';
import db from '../models/db';

export async function newActiveUserAsync(): Promise<User> {
    const dataSource = await db();
    const userRepository = dataSource.getRepository('User');
    let user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.setPassword('password');
    user.userStatus = UserStatus.ACTIVE;
    user = (await userRepository.save(user)) as User;
    return user;
}

export async function newInactiveUserAsync(): Promise<User> {
    const dataSource = await db();
    const userRepository = dataSource.getRepository('User');
    let user = new User();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.setPassword('password');
    user.generateInvitationCode();
    user = (await userRepository.save(user)) as User;
    return user;
}

export async function newGovernmentAsync(name?: string): Promise<Government> {
    const dataSource = await db();
    const repository = dataSource.getRepository('Government');
    let government = new Government();
    government.name = name || faker.location.city();
    government = (await repository.save(government)) as Government;
    return government;
}

export async function newCampaignAsync(gov?: Government): Promise<Campaign> {
    const dataSource = await db();
    const govRepository = dataSource.getRepository('Government');
    const campaignRepository = dataSource.getRepository('Campaign');
    let government = new Government();
    government.name = faker.location.city();
    government = (await govRepository.save(government)) as Government;
    let campaign = new Campaign();
    campaign.name = `${faker.person.lastName()} for Mayor`;
    campaign.government = gov || government;
    campaign.officeSought = 'Mayor';
    campaign = (await campaignRepository.save(campaign)) as Campaign;
    return campaign;
}

export async function newContributionAsync(campaign: Campaign, government: Government): Promise<Contribution> {
    const dataSource = await db();
    let contribution = new Contribution();
    contribution.address1 = faker.location.streetAddress();
    contribution.amount = parseInt(faker.finance.amount({ min: 1, max: 500, dec: 2 }));
    contribution.campaign = campaign;
    contribution.city = 'Portland';
    contribution.firstName = faker.person.firstName();
    contribution.middleInitial = '';
    contribution.lastName = faker.person.lastName();
    contribution.government = government;
    contribution.type = ContributionType.CONTRIBUTION;
    contribution.subType = ContributionSubType.CASH;
    contribution.state = 'OR';
    contribution.status = ContributionStatus.DRAFT;
    contribution.zip = '97214';
    contribution.paymentMethod = PaymentMethod.CHECK;
    contribution.checkNumber = '123456';
    contribution.contributorType = ContributorType.INDIVIDUAL;
    contribution.date = faker.date.past();
    const contributionRepository = dataSource.getRepository('Contribution');
    contribution = await contributionRepository.save(contribution);
    if (process.env.NODE_ENV != 'test') {
        console.log('saving contribution', contribution.id);
    }
    return contribution;
}

export async function newExternalContributionAsync(): Promise<ExternalContribution> {
    const dataSource = await db();
    let externalContribution = new ExternalContribution();
    externalContribution.orestarOriginalId = ((global as any).externalContributionCounter + 1).toString();
    externalContribution.orestarTransactionId = ((global as any).externalContributionCounter + 1).toString();
    (global as any).externalContributionCounter += 1;
    externalContribution.address1 = faker.location.streetAddress();
    externalContribution.amount = parseInt(faker.finance.amount({ min: 1, max: 500, dec: 2 }));
    externalContribution.city = 'Portland';
    externalContribution.type = ContributionType.CONTRIBUTION;
    externalContribution.subType = ExternalContributionSubType.CASH;
    externalContribution.state = 'OR';
    externalContribution.zip = '97214';
    externalContribution.contributorType = ContributorType.INDIVIDUAL;
    externalContribution.employerName = 'Random Employer';
    externalContribution.employerCity = 'Portland';
    externalContribution.employerState = 'OR';
    externalContribution.country = 'United States';
    externalContribution.date = faker.date.past();
    const externalContributionRepository = dataSource.getRepository('external_contributions');
    externalContribution = await externalContributionRepository.save(externalContribution);
    if (process.env.NODE_ENV != 'test') {
        console.log('saving contribution', externalContribution.orestarOriginalId);
    }
    return externalContribution;
}

export async function newBulkContributionAsync(
    campaign: Campaign,
    government: Government
): Promise<IContributionSummaryResults> {
    const bulkContributionsArray: IContributionSummary[] = [];
    for (let i = 0; i < 5; i++) {
        bulkContributionsArray.push(await newContributionAsync(campaign, government));
    }
    return {
        data: bulkContributionsArray,
    } as any;
}

export async function newExpenditureAsync(campaign: Campaign, government: Government): Promise<Expenditure> {
    const dataSource = await db();
    let expenditure = new Expenditure();
    expenditure.address1 = faker.location.streetAddress();
    expenditure.amount = parseInt(faker.finance.amount({ min: 1, max: 500, dec: 2 }));
    expenditure.campaign = campaign;
    expenditure.city = 'Portland';
    expenditure.name = faker.person.fullName();
    expenditure.government = government;
    expenditure.type = ExpenditureType.EXPENDITURE;
    expenditure.subType = ExpenditureSubType.CASH_EXPENDITURE;
    expenditure.state = 'OR';
    expenditure.status = ExpenditureStatus.DRAFT;
    expenditure.zip = '97214';
    expenditure.payeeType = PayeeType.INDIVIDUAL;
    expenditure.paymentMethod = PaymentMethod.CASH;
    expenditure.purpose = PurposeType.GENERAL_OPERATING;
    expenditure.date = faker.date.past();
    const expenditureRepository = dataSource.getRepository('Expenditure');
    expenditure = await expenditureRepository.save(expenditure);
    if (process.env.NODE_ENV != 'test') {
        console.log('saving expenditure', expenditure.id);
    }
    return expenditure;
}

export async function newBulkExpenditureAsync(
    campaign: Campaign,
    government: Government
): Promise<IExpenditureSummaryResults> {
    const bulkExpendituresArray: IExpenditureSummary[] = [];
    for (let i = 0; i < 5; i++) {
        bulkExpendituresArray.push(await newExpenditureAsync(campaign, government));
    }
    return {
        data: bulkExpendituresArray,
    } as any;
}

export async function truncateAll() {
    const dataSource = await db();
    if (process.env.NODE_ENV === 'production' && process.env.APP_ENV !== 'staging') {
        throw new Error('Cant run truncate in production');
    }
    try {
        const connection = dataSource;
        await connection.query('TRUNCATE "government" RESTART IDENTITY CASCADE');
        await connection.query('TRUNCATE "users" RESTART IDENTITY CASCADE');
        await connection.query('TRUNCATE "campaign" RESTART IDENTITY CASCADE');
        await connection.query('TRUNCATE "permission" RESTART IDENTITY CASCADE');
        await connection.query('TRUNCATE "activity" RESTART IDENTITY CASCADE');
        await connection.query('TRUNCATE "expenditures" RESTART IDENTITY CASCADE');
        await connection.query('TRUNCATE "contributions" RESTART IDENTITY CASCADE');
        await connection.query('TRUNCATE "addresses" RESTART IDENTITY CASCADE');
        if (process.env.NODE_ENV !== 'production') {
            try {
                await connection.query('TRUNCATE "gis_boundaries" RESTART IDENTITY CASCADE');
            } catch (error) {
                if (process.env.NODE_ENV !== 'test') {
                    console.log('table gis_boundaries not found');
                }
            }
        }
    } catch (error) {
        console.error('Error truncating tables:', error);
        throw error;
    } finally {
        await dataSource.destroy(); // Ensure the connection is closed
    }
}
