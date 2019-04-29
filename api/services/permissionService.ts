import { getConnection } from 'typeorm';
import { Permission, UserRole } from '../models/entity/Permission';
import { Campaign } from '../models/entity/Campaign';
import { User } from '../models/entity/User';
import { Government } from '../models/entity/Government';

export async function addPermissionAsync(userId: number, role: UserRole, campaignId?: number, governmentId?: number): Promise<Permission> {
    const userRepository = getConnection('default').getRepository('User');
    const campaignRepository = getConnection('default').getRepository('Campaign');
    const govRepository = getConnection('default').getRepository('Government');
    const permissionRepository = getConnection('default').getRepository('Permission');

    const permission = new Permission();
    const userToAdd = await userRepository.findOneOrFail(userId) as User;
    permission.user = userToAdd;
    permission.role = role;

    let campaign: Campaign;

    if (campaignId) {
        campaign = await campaignRepository.findOneOrFail(campaignId) as Campaign;
        permission.campaign = campaign;
        permission.government = campaign.government;
    }
    let government: Government;
    if (governmentId) {
        government = await govRepository.findOneOrFail(governmentId) as Government;
        permission.government = government;
    }
    if (await permission.isValidAsync()) {
        await permissionRepository.save(permission);
    }

    return permission;
}

export async function removePermissionAsync(permissionId: number): Promise<boolean> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permission = await permissionRepository.findOne(permissionId);
    if (permission) {
        return (await permissionRepository.delete(permissionId)).affected === 1;
    }
    return false;
}

export async function isGovernmentAdminAsync(userId, governmentId: number): Promise<boolean> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permission = await permissionRepository.createQueryBuilder('permission')
        .where('"userId" = :userId', { userId})
        .andWhere('"governmentId" = :governmentId', { governmentId})
        .andWhere('"role" = :role', { role: UserRole.GOVERNMENT_ADMIN})
        .getOne();

    return !!permission;
}

export async function isCampaignAdminAsync(userId, campaignId: number): Promise<boolean> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permission = await permissionRepository.createQueryBuilder('permission')
        .where('"userId" = :userId', { userId})
        .andWhere('"campaignId" = :campaignId', { campaignId})
        .andWhere('"role" = :role', { role: UserRole.CAMPAIGN_ADMIN})
        .getOne();

    return !!permission;
}

export async function isCampaignStaffAsync(userId, campaignId: number): Promise<boolean> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permission = await permissionRepository.createQueryBuilder('permission')
        .where('"userId" = :userId', { userId})
        .andWhere('"campaignId" = :campaignId', { campaignId})
        .andWhere('"role" = :role', { role: UserRole.CAMPAIGN_STAFF})
        .getOne();

    return !!permission;
}
