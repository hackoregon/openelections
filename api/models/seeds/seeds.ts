import { getConnection } from 'typeorm';
import { createUserAsync } from '../../services/userService';
import { newCampaignAsync, newExpenditureAsync, newGovernmentAsync, truncateAll } from '../../test/factories';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../entity/Permission';
import { User, UserStatus } from '../../models/entity/User';
import { Address } from '../../models/entity/Address';
import * as fs from 'fs';
import * as parse from 'csv-parse/lib/sync';
import { addContributionAsync } from '../../services/contributionService';
import { ContributionSubType, ContributionType, ContributorType, PaymentMethod, OaeType, InKindDescriptionType } from '../entity/Contribution';
import * as faker from 'faker';
import { Government } from '../entity/Government';
import { Campaign } from '../entity/Campaign';

function chunk(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
        const last = chunked_arr[chunked_arr.length - 1];
        if (!last || last.length === size) {
            chunked_arr.push([array[i]]);
        } else {
            last.push(array[i]);
        }
    }
    return chunked_arr;
}

const ALLOWABLE_CONTRIBUTION_SUBTYPES = [
    'CASH', 'INKIND_CONTRIBUTION', 'INKIND_PAID_SUPERVISION', 'INKIND_FORGIVEN_ACCOUNT', 'INKIND_FORGIVEN_PERSONAL'
];

function randomFrom(array) {
    return array.length && array[Math.floor(Math.random()*array.length)];
}

function randomEnum<T>(anEnum: T, filterArray?: Array<String>): T[keyof T] {
    const arrayForSelection = filterArray || Object.keys(anEnum);
    return anEnum[randomFrom(arrayForSelection)];
}

function randomInKindType(contributionSubType: ContributionSubType) {
    return (contributionSubType === 'cash') ? undefined : randomEnum(InKindDescriptionType);
}

function randomName(contributorType: ContributorType) {
    return (contributorType === 'individual' || contributorType === 'family') ? undefined : faker.company.companyName();
}

export async function seedAddresses() {
    let data: any;
    if (process.env.NODE_ENV === 'test') {
        data = fs.readFileSync('/app/models/seeds/addressesTest.csv', 'utf8');
    } else {
        data = fs.readFileSync('/app/models/seeds/addresses.csv', 'utf8');
    }

    const parsed = parse(data, {
        columns: true,
        skip_empty_lines: true
    });

    const chunks = chunk(parsed, 1000);
    let i = 0;
    const promises = [];
    chunks.forEach((addressArray: any): void => {
        const query = getConnection()
            .createQueryBuilder()
            .insert()
            .into(Address)
            .values(addressArray)
            .execute();
        promises.push(query);
        i++;
    });
    await Promise.all(promises);
}

export function addGISBoundaries() {
    require('child_process').execSync(
        `ogr2ogr -f "PostgreSQL" PG:"host=${process.env.DB_HOST} user=${process.env.DB_USERNAME} password=${process.env.DB_PASSWORD} dbname=${process.env.DB_NAME}" "/app/models/seeds/geometry/cty_fill.shp" -lco GEOMETRY_NAME=the_geom -lco FID=gid -nlt PROMOTE_TO_MULTI -nln gis_boundaries -overwrite`
    );
}

export interface Address {
    firstName: string;
    middleName: string;
    lastName: string;
    county: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    zipPlusFour;
}

export async function addContributions(user: User, government: Government, campaign: Campaign, campaigns: Array<Campaign>) {
    let data: any;
    if (process.env.NODE_ENV === 'test') {
        data = fs.readFileSync('/app/models/seeds/addressesTest.csv', 'utf8');
    } else {
        data = fs.readFileSync('/app/models/seeds/addresses.csv', 'utf8');
    }

    // firstName,middleName,lastName,county,address1,address2,city,state,zip,zipPlusFour
    const promises = [];

    const parsed: Address[] = parse(data, {
        columns: true,
        skip_empty_lines: true
    });

    parsed.forEach((address: Address) => {
        const randomSubType = randomEnum(ContributionSubType, ALLOWABLE_CONTRIBUTION_SUBTYPES);
        const randomContributorType = randomEnum(ContributorType);
        promises.push(addContributionAsync({
            firstName: address.firstName,
            lastName: address.lastName,
            name: randomName(randomContributorType),
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            state: address.state,
            zip: address.zip,
            contributorType: randomContributorType,
            type: ContributionType.CONTRIBUTION,
            subType: randomSubType,
            inKindType: randomInKindType(randomSubType),
            amount: faker.finance.amount(1, 500, 2),
            date: faker.date.past(1),
            governmentId: government.id,
            campaignId: randomFrom(campaigns).id,
            currentUserId: user.id,
            paymentMethod: PaymentMethod.CREDIT_CARD_ONLINE,
            oaeType: OaeType.ALLOWABLE,
            occupation: 'Other'
        }));
    });

    return Promise.all(promises);
}

export default async (onlyData?: boolean) => {
    if (process.env.NODE_ENV === 'production' && process.env.APP_ENV !== 'staging') {
        return console.log('Can only seed in staging, test or development mode');
    }

    await truncateAll();
    if (!onlyData) {
        console.log('Adding a gis boundaries admin');
        addGISBoundaries();
    }

    console.log('Adding a government admin');
    const govAdmin = await createUserAsync({
        email: 'govadmin@openelectionsportland.org',
        password: 'password',
        firstName: 'Government',
        lastName: 'Admin'
    });

    console.log('Adding a campaign admin');
    const campaignAdmin = await createUserAsync({
        email: 'campaignadmin@openelectionsportland.org',
        password: 'password',
        firstName: 'Campaign',
        lastName: 'Admin'
    });

    console.log('Adding a campaign staff');
    const campaignStaff = await createUserAsync({
        email: 'campaignstaff@openelectionsportland.org',
        password: 'password',
        firstName: 'Campaign',
        lastName: 'Staff'
    });

    console.log('Adding a campaign staff');
    const campaignStaffInvited = await createUserAsync({
        email: 'campaignstaff+1@openelectionsportland.org',
        invitationCode: 'inviteme',
        firstName: 'Campaign',
        lastName: 'Staff'
    });

    console.log('Adding a campaign staff');
    const campaignStaffRemoved = await createUserAsync({
        email: 'campaignstaff+removeme@openelectionsportland.org',
        password: 'password',
        firstName: 'Campaign',
        lastName: 'Staff'
    });

    console.log('Adding a campaign staff');
    const campaignStaffRemoved2 = await createUserAsync({
        email: 'campaignstaff+removeme2@openelectionsportland.org',
        password: 'password',
        firstName: 'Campaign',
        lastName: 'Staff'
    });

    const userRepository = getConnection('default').getRepository('User');
    let campaignStaffReset = new User();
    campaignStaffReset.email = 'campaignstaff+2@openelectionsportland.org';
    campaignStaffReset.firstName = 'Campaign';
    campaignStaffReset.lastName = 'Staff';
    campaignStaffReset.userStatus = UserStatus.ACTIVE;
    campaignStaffReset.setPassword('password');
    campaignStaffReset.invitationCode = 'resetme';
    campaignStaffReset = await userRepository.save(campaignStaffReset);

    console.log('Adding a government');
    const government = await newGovernmentAsync('City of Portland');

    console.log('Adding campaigns');
    const campaign = await newCampaignAsync(government);
    const campaignb = await newCampaignAsync(government);
    const campaigns = await Promise.all([ campaign, campaignb ]);

    await addPermissionAsync({
        userId: govAdmin.id,
        role: UserRole.GOVERNMENT_ADMIN,
        governmentId: government.id
    });

    async function addPermissionsForCampaign(campaign: Campaign) {
        await addPermissionAsync({
            userId: campaignAdmin.id,
            role: UserRole.CAMPAIGN_ADMIN,
            campaignId: campaign.id
        });

        await addPermissionAsync({
            userId: campaignStaff.id,
            role: UserRole.CAMPAIGN_STAFF,
            campaignId: campaign.id
        });

        await addPermissionAsync({
            userId: campaignStaffInvited.id,
            role: UserRole.CAMPAIGN_STAFF,
            campaignId: campaign.id
        });

        await addPermissionAsync({
            userId: campaignStaffReset.id,
            role: UserRole.CAMPAIGN_STAFF,
            campaignId: campaign.id
        });

        await addPermissionAsync({
            userId: campaignStaffRemoved.id,
            role: UserRole.CAMPAIGN_STAFF,
            campaignId: campaign.id
        });

        await addPermissionAsync({
            userId: campaignStaffRemoved2.id,
            role: UserRole.CAMPAIGN_STAFF,
            campaignId: campaign.id
        });
    }

    await addPermissionsForCampaign(campaign);
    await addPermissionsForCampaign(campaignb);
    await seedAddresses();

    const promises = [];
    await addContributions(campaignAdmin, government, campaign, campaigns);
    for (let i = 0; i < 101; i++) {
        promises.push(newExpenditureAsync(campaign, government));
    }
    await Promise.all(promises);
};
