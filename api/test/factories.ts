import * as faker from 'faker';
import { User, UserStatus } from '../models/entity/User';
import { getConnection } from 'typeorm';
import { Government } from '../models/entity/Government';
import { Campaign } from '../models/entity/Campaign';
import {
    Contribution,
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType,
    IContributionSummary,
    IContributionSummaryResults
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
    IExpenditureSummary
} from '../models/entity/Expenditure';

export async function newActiveUserAsync(): Promise<User> {
    const userRepository = getConnection('default').getRepository('User');
    let user = new User();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.email = faker.internet.email();
    user.setPassword('password');
    user.userStatus = UserStatus.ACTIVE;
    user = await userRepository.save(user) as User;
    return user;
}

export async function newInactiveUserAsync(): Promise<User> {
    const userRepository = getConnection('default').getRepository('User');
    let user = new User();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.email = faker.internet.email();
    user.setPassword('password');
    user.generateInvitationCode();
    user = await userRepository.save(user) as User;
    return user;
}

export async function newGovernmentAsync(name?: string): Promise<Government> {
    const repository = getConnection('default').getRepository('Government');
    let government = new Government();
    government.name = name || faker.address.city();
    government = await repository.save(government) as Government;
    return government;
}

export async function newCampaignAsync(gov?: Government): Promise<Campaign> {
    const govRepository = getConnection('default').getRepository('Government');
    const campaignRepository = getConnection('default').getRepository('Campaign');
    let government = new Government();
    government.name = faker.address.city();
    government = await govRepository.save(government) as Government;
    let campaign = new Campaign();
    campaign.name = `${faker.name.lastName()} for Mayor`;
    campaign.government = gov || government;
    campaign.officeSought = 'Mayor';
    campaign = await campaignRepository.save(campaign) as Campaign;
    return campaign;
}

export async function newContributionAsync(campaign: Campaign, government: Government): Promise<Contribution> {
    let contribution = new Contribution();
        contribution.address1 = faker.address.streetAddress();
        contribution.amount = faker.finance.amount(1, 500, 2);
        contribution.campaign = campaign;
        contribution.city = 'Portland';
        contribution.firstName = faker.name.firstName();
        contribution.middleInitial = '';
        contribution.lastName = faker.name.lastName();
        contribution.government = government;
        contribution.type = ContributionType.CONTRIBUTION;
        contribution.subType = ContributionSubType.CASH;
        contribution.state = 'OR';
        contribution.status = ContributionStatus.DRAFT;
        contribution.zip = '97214';
        contribution.paymentMethod = PaymentMethod.CASH;
        contribution.contributorType = ContributorType.INDIVIDUAL;
        contribution.date = faker.date.past(1);
    const contributionRepository = getConnection('default').getRepository('Contribution');
    contribution = await contributionRepository.save(contribution);
    if (process.env.NODE_ENV != 'test') {
        console.log('saving contribution', contribution.id);
    }
    return contribution;
}

export async function newBulkContributionAsync(campaign: Campaign, government: Government): Promise<IContributionSummaryResults> {
    const bulkContributionsArray: IContributionSummary[] = [];
    for (let i = 0; i < 5; i++) {
        bulkContributionsArray.push(await newContributionAsync(campaign, government));
    }
    return ({
        data: bulkContributionsArray,
    } as any);
}

export async function newExpenditureAsync(campaign: Campaign, government: Government): Promise<Expenditure> {
    let expenditure = new Expenditure();
    expenditure.address1 = faker.address.streetAddress();
    expenditure.amount = faker.finance.amount(1, 500, 2);
    expenditure.campaign = campaign;
    expenditure.city = 'Portland';
    expenditure.name = faker.name.findName();
    expenditure.government = government;
    expenditure.type = ExpenditureType.EXPENDITURE;
    expenditure.subType = ExpenditureSubType.CASH_EXPENDITURE;
    expenditure.state = 'OR';
    expenditure.status = ExpenditureStatus.DRAFT;
    expenditure.zip = '97214';
    expenditure.payeeType = PayeeType.INDIVIDUAL;
    expenditure.paymentMethod = PaymentMethod.CASH;
    expenditure.purpose = PurposeType.GENERAL_OPERATING;
    expenditure.date = faker.date.past(1);
    const expenditureRepository = getConnection('default').getRepository('Expenditure');
    expenditure = await expenditureRepository.save(expenditure);
    if (process.env.NODE_ENV != 'test') {
        console.log('saving expenditure', expenditure.id);
    }
    return expenditure;
}

export async function newBulkExpenditureAsync(campaign: Campaign, government: Government): Promise<IExpenditureSummaryResults> {
    const bulkExpendituresArray: IExpenditureSummary[] = [];
    for (let i = 0; i < 5; i++) {
        bulkExpendituresArray.push(await newExpenditureAsync(campaign, government));
    }
    return ({
        data: bulkExpendituresArray,
    } as any);
}


export async function truncateAll() {
    if (process.env.NODE_ENV === 'production' && process.env.APP_ENV !== 'staging') {
        throw new Error('Cant run truncate in production');
    }
    const connection = getConnection('default');
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
}
