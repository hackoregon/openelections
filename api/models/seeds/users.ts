import { createUserAsync } from '../../services/userService';
import { newCampaignAsync, newGovernmentAsync, truncateAll } from '../../test/factories';
import { addPermissionAsync } from '../../services/permissionService';
import { UserRole } from '../entity/Permission';

export default async () => {
    if (process.env.NODE_ENV === 'production') {
        return console.log('Can only seed in staging, test or development mode');
    }

    await truncateAll();

    const govAdmin = await createUserAsync({
        email: 'govAdmin@openelectionsportland.org',
        password: 'password',
        firstName: 'Government',
        lastName: 'Admin'
    });

    const campaignAdmin = await createUserAsync({
        email: 'campaignAdmin@openelectionsportland.org',
        password: 'password',
        firstName: 'Campaign',
        lastName: 'Admin'
    });

    const campaignStaff = await createUserAsync({
        email: 'campaignStaff@openelectionsportland.org',
        password: 'password',
        firstName: 'Campaign',
        lastName: 'Staff'
    });

    const campaignStaffInvited = await createUserAsync({
        email: 'campaignStaff+1@openelectionsportland.org',
        invitationCode: 'inviteme',
        firstName: 'Campaign',
        lastName: 'Staff'
    });

    const government = await newGovernmentAsync('City of Portland');
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
};
