import * as faker from 'faker';
import { User, UserStatus } from '../models/entity/User';
import { getConnection, getManager } from 'typeorm';
import { Government } from '../models/entity/Government';
import { Campaign } from '../models/entity/Campaign';
import {
    Contribution,
    ContributionStatus,
    ContributionSubType,
    ContributionType,
    ContributorType
} from '../models/entity/Contribution';

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
    campaign = await campaignRepository.save(campaign) as Campaign;
    return campaign;
}

export async function newContributionAsync(campaign: Campaign, government: Government): Promise<Contribution> {
    let contribution = new Contribution();
        contribution.address1 = faker.address.streetAddress();
        contribution.amount = faker.finance.amount(0, 500, 2);
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
        contribution.contributorType = ContributorType.INDIVIDUAL;
    const contributionRepository = getConnection('default').getRepository('Contribution');
    contribution = await contributionRepository.save(contribution);
    console.log('saving contribution', contribution.id)
    return contribution;
}


export async function truncateAll() {
    const connection = getConnection('default');
    await connection.query('TRUNCATE "government" RESTART IDENTITY CASCADE');
    await connection.query('TRUNCATE "users" RESTART IDENTITY CASCADE');
    await connection.query('TRUNCATE "campaign" RESTART IDENTITY CASCADE');
    await connection.query('TRUNCATE "permission" RESTART IDENTITY CASCADE');
    await connection.query('TRUNCATE "activity" RESTART IDENTITY CASCADE');
}
