import { getConnection } from 'typeorm';
import { createUserAsync } from '../../services/userService';
import { newCampaignAsync, newGovernmentAsync, truncateAll, newContributionAsync } from '../../test/factories';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../entity/Permission';
import { User, UserStatus } from '../../models/entity/User';


export default async () => {
    if (process.env.NODE_ENV === 'production') {
        return console.log('Can only seed in staging, test or development mode');
    }

    await truncateAll();

    console.log('Adding a government admin');
    const govAdmin = await createUserAsync({
        email: 'govAdmin@openelectionsportland.org',
        password: 'password',
        firstName: 'Government',
        lastName: 'Admin'
    });

    console.log('Adding a campaign admin');
    const campaignAdmin = await createUserAsync({
        email: 'campaignAdmin@openelectionsportland.org',
        password: 'password',
        firstName: 'Campaign',
        lastName: 'Admin'
    });

    console.log('Adding a campaign staff');
    const campaignStaff = await createUserAsync({
        email: 'campaignStaff@openelectionsportland.org',
        password: 'password',
        firstName: 'Campaign',
        lastName: 'Staff'
    });

    console.log('Adding a campaign staff');
    const campaignStaffInvited = await createUserAsync({
        email: 'campaignStaff+1@openelectionsportland.org',
        invitationCode: 'inviteme',
        firstName: 'Campaign',
        lastName: 'Staff'
    });

    const userRepository = getConnection('default').getRepository('User');
    let campaignStaffReset = new User();
    campaignStaffReset.email = 'campaignStaff+2@openelectionsportland.org';
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

    const promises = [];
    for (let i = 0; i < 101; i++) {
        promises.push(newContributionAsync(campaign, government));
    }
    await Promise.all(promises);
};
