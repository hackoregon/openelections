import { getConnection } from 'typeorm';
import { createUserAsync } from '../../services/userService';
import {
    newCampaignAsync,
    newGovernmentAsync,
    truncateAll,
    newContributionAsync,
    newExpenditureAsync
} from '../../test/factories';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../entity/Permission';
import { User, UserStatus } from '../../models/entity/User';
import { Address } from '../../models/entity/Address';
import * as fs from 'fs';
import * as parse from 'csv-parse/lib/sync';

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

    return getConnection()
        .createQueryBuilder()
        .insert()
        .into(Address)
        .values(parsed)
        .execute();
}

export default async () => {
    if (process.env.NODE_ENV === 'production') {
        return console.log('Can only seed in staging, test or development mode');
    }

    await truncateAll();

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

    console.log('Adding a campaign');
    const campaign = await newCampaignAsync(government);
    await newCampaignAsync(government);
    await newCampaignAsync(government);
    await newCampaignAsync(government);

    await addPermissionAsync({
        userId: govAdmin.id,
        role: UserRole.GOVERNMENT_ADMIN,
        governmentId: government.id
    });

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

    const promises = [];
    for (let i = 0; i < 101; i++) {
        promises.push(newContributionAsync(campaign, government));
        promises.push(newExpenditureAsync(campaign, government));
    }
    promises.push(seedAddresses());
    await Promise.all(promises);
};
