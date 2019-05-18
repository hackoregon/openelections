import * as faker from 'faker';
import { User, UserStatus } from '../models/entity/User';
import { getConnection } from 'typeorm';
import { Government } from '../models/entity/Government';
import { Campaign } from '../models/entity/Campaign';

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

export async function newGovernmentAsync(): Promise<Government> {
    const repository = getConnection('default').getRepository('Government');
    let government = new Government();
    government.name = faker.address.city();
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

export async function truncateAll() {
    const connection = getConnection('default');
    await connection.query('TRUNCATE "government" CASCADE');
    await connection.query('TRUNCATE "users" CASCADE');
    await connection.query('TRUNCATE "campaign" CASCADE');
    await connection.query('TRUNCATE "permission" CASCADE');
    await connection.query('TRUNCATE "activity" CASCADE');
}
