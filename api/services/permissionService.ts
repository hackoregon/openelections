import * as jsonwebtoken from 'jsonwebtoken';
import { Permission, UserRole } from '../models/entity/Permission';
import { Campaign } from '../models/entity/Campaign';
import { User } from '../models/entity/User';
import { Government } from '../models/entity/Government';
import { createUserAsync } from './userService';
import { sendInvitationEmail, sendNewUserInvitationEmail } from './emailService';
import { createActivityRecordAsync } from './activityService';
import { ActivityTypeEnum } from '../models/entity/Activity';
import db from '../models/db';

export interface IAddPermissionAsyncAttrs {
    userId: number;
    role: UserRole;
    campaignId?: number;
    governmentId?: number;
}

export async function addPermissionAsync(attrs: IAddPermissionAsyncAttrs): Promise<Permission> {
    const dataSource = await db();
    const userRepository = dataSource.getRepository('User');
    const campaignRepository = dataSource.getRepository('Campaign');
    const govRepository = dataSource.getRepository('Government');
    const permissionRepository = dataSource.getRepository('Permission');

    const permission = new Permission();
    const userToAdd = (await userRepository.findOneOrFail({ where: { id: attrs.userId } }).catch(() => {
        throw new Error(`Could not find any entity of type "User" matching: ${attrs.userId}`);
    })) as User;
    permission.user = userToAdd;
    permission.role = attrs.role;

    let campaign: Campaign;

    if (attrs.campaignId) {
        campaign = (await campaignRepository.findOneOrFail({ where: { id: attrs.campaignId } }).catch(() => {
            throw new Error(`Could not find any entity of type "Campaign" matching: ${attrs.campaignId}`);
        })) as Campaign;
        permission.campaign = campaign;
        permission.government = campaign.government;
    }
    let government: Government;
    if (attrs.governmentId) {
        government = (await govRepository.findOneOrFail({ where: { id: attrs.governmentId } }).catch(() => {
            throw new Error(`Could not find any entity of type "Government" matching: ${attrs.governmentId}`);
        })) as Government;
        permission.government = government;
    }
    if (await permission.isValidAsync()) {
        await permissionRepository.save(permission);
    } else {
        throw new Error(`Permission invalid ${permission.errors}`);
    }

    return permission;
}

export interface IRemovePermissionAsyncAttrs {
    userId: number;
    permissionId: number;
}

export async function removePermissionAsync(attrs: IRemovePermissionAsyncAttrs): Promise<void> {
    const dataSource = await db();
    const permissionRepository = dataSource.getRepository('Permission');
    const permission = (await permissionRepository.findOneOrFail({ where: { id: attrs.permissionId } }).catch(() => {
        throw new Error(`Could not find any entity of type "Permission" matching: ${attrs.permissionId}`);
    })) as Permission;
    if (permission) {
        if (
            (await isGovernmentAdminAsync(attrs.userId, permission.government.id)) ||
            (await isCampaignAdminAsync(attrs.userId, permission.campaign.id))
        ) {
            await permissionRepository.delete(attrs.permissionId);
        } else {
            throw new Error('User must be an admin');
        }
    } else {
        throw new Error('Supply a valid permission id');
    }
}

export async function isGovernmentAdminAsync(userId, governmentId: number): Promise<boolean> {
    const dataSource = await db();
    const permissionRepository = dataSource.getRepository('Permission');
    const permission = await permissionRepository
        .createQueryBuilder('permission')
        .where('"userId" = :userId', { userId })
        .andWhere('"governmentId" = :governmentId', { governmentId })
        .andWhere('"role" = :role', { role: UserRole.GOVERNMENT_ADMIN })
        .getOne();
    return !!permission;
}

export async function isCampaignAdminAsync(userId, campaignId: number): Promise<boolean> {
    const dataSource = await db();
    const permissionRepository = dataSource.getRepository('Permission');
    const permission = await permissionRepository
        .createQueryBuilder('permission')
        .where('"userId" = :userId', { userId })
        .andWhere('"campaignId" = :campaignId', { campaignId })
        .andWhere('"role" = :role', { role: UserRole.CAMPAIGN_ADMIN })
        .getOne();
    return !!permission;
}

export async function isCampaignStaffAsync(userId, campaignId: number): Promise<boolean> {
    try {
        const dataSource = await db();
        const permissionRepository = dataSource.getRepository('Permission');

        const permission = await permissionRepository.findOne({
            where: {
                user: { id: userId },
                campaign: { id: campaignId },
                role: UserRole.CAMPAIGN_STAFF,
            },
        });

        return !!permission;
    } catch (error) {
        console.error('Error checking campaign staff permission:', error);
        return false;
    }
}

export interface IAddUserCampaignAttrs {
    email: string;
    firstName: string;
    lastName: string;
    campaignId: number;
    role: UserRole;
    currentUserId: number;
}

export async function addUserToCampaignAsync(attrs: IAddUserCampaignAttrs): Promise<Permission> {
    const dataSource = await db();
    const userRepository = dataSource.getRepository('User');
    const campaignRepository = dataSource.getRepository('Campaign');
    const campaign = (await campaignRepository.findOneOrFail({ where: { id: attrs.campaignId } }).catch(() => {
        throw new Error(`Could not find any entity of type "Campaign" matching: ${attrs.campaignId}`);
    })) as Campaign;
    const currentUser = (await userRepository.findOneOrFail({ where: { id: attrs.currentUserId } })) as User;
    if (
        (await isCampaignAdminAsync(attrs.currentUserId, attrs.campaignId)) ||
        (await isGovernmentAdminAsync(attrs.currentUserId, campaign.government.id))
    ) {
        let user = (await userRepository.findOne({ where: { email: attrs.email } })) as User;
        if (!user) {
            user = await createUserAsync({
                email: attrs.email,
                firstName: attrs.firstName,
                lastName: attrs.lastName,
            });
            await sendNewUserInvitationEmail({
                to: user.email,
                invitationCode: user.invitationCode,
                campaignName: campaign.name,
            });
            await createActivityRecordAsync({
                currentUser: user,
                notes: `${user.name()} was sent an invitation email to ${user.email}`,
                government: await campaign.government,
                campaign: campaign,
                activityType: ActivityTypeEnum.INVITATION_EMAIL,
                activityId: user.id,
            });
        } else {
            await sendInvitationEmail({
                to: user.email,
                campaignName: campaign.name,
            });
        }
        const permission = await addPermissionAsync({
            userId: user.id,
            role: attrs.role,
            campaignId: campaign.id,
            governmentId: campaign.government.id,
        });
        await createActivityRecordAsync({
            currentUser: user,
            notes: `${currentUser.name()} added ${user.name()} to ${campaign.name} as a ${permission.role}`,
            government: await campaign.government,
            campaign: campaign,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: permission.id,
        });
        return permission;
    }
    throw new Error('user does not have sufficient permissions');
}

export interface IAddUserGovAttrs {
    email: string;
    firstName: string;
    lastName: string;
    governmentId: number;
    role: UserRole;
    currentUserId: number;
}

export async function addUserToGovernmentAsync(attrs: IAddUserGovAttrs): Promise<Permission> {
    const dataSource = await db();
    const userRepository = dataSource.getRepository('User');
    const governmentRepository = dataSource.getRepository('Government');
    const government = (await governmentRepository.findOneOrFail({ where: { id: attrs.governmentId } }).catch(() => {
        throw new Error(`Could not find any entity of type "Government" matching: ${attrs.governmentId}`);
    })) as Government;
    const currentUser = (await userRepository.findOneOrFail({ where: { id: attrs.currentUserId } })) as User;
    if (await isGovernmentAdminAsync(attrs.currentUserId, government.id)) {
        let user = (await userRepository.findOne({ where: { email: attrs.email } })) as User;
        if (!user) {
            user = await createUserAsync({
                email: attrs.email,
                firstName: attrs.firstName,
                lastName: attrs.lastName,
            });
            await sendNewUserInvitationEmail({
                to: user.email,
                invitationCode: user.invitationCode,
                governmentName: government.name,
            });
            await createActivityRecordAsync({
                currentUser: user,
                notes: `${user.name()} was sent an invitation email to ${user.email}`,
                government: government,
                activityType: ActivityTypeEnum.INVITATION_EMAIL,
                activityId: user.id,
            });
        } else {
            await sendInvitationEmail({
                to: user.email,
                governmentName: government.name,
            });
        }
        const permission = await addPermissionAsync({ userId: user.id, role: attrs.role, governmentId: government.id });
        await createActivityRecordAsync({
            currentUser: user,
            notes: `${currentUser.name()} added ${user.name()} to ${government.name} as a ${permission.role}`,
            government: government,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: permission.id,
        });
        return permission;
    }
    throw new Error('user does not have sufficient permissions');
}

export enum PermissionEntity {
    GOVERNMENT = 'government',
    CAMPAIGN = 'campaign',
}

export interface IToken {
    id: number;
    exp: number;
    firstName: string;
    lastName: string;
    email: string;
    permissions: {
        id: number;
        type: PermissionEntity;
        role: UserRole;
        campaignId?: number;
        governmentId?: number;
        governmentName?: string;
        campaignName?: string;
    }[];
}

export async function createTokenObjectAsync(userId: number): Promise<IToken> {
    const dataSource = await db();
    const userRepository = dataSource.getRepository('User');
    const permissionRepository = dataSource.getRepository('Permission');
    const user = (await userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
        throw new Error(`Could not find any entity of type "User" matching: ${userId}`);
    })) as User;
    const permissions = (await permissionRepository.find({
        where: {
            user: {
                id: userId,
            },
        },
        relations: ['campaign', 'government', 'user'],
    })) as Permission[];
    const exp = Date.now() + 72 * 60 * 60 * 1000; // 72 hours from now in miliseconds
    return {
        id: userId,
        exp,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        permissions: permissions.map((item) => {
            return {
                role: item.role,
                type: item.role === UserRole.GOVERNMENT_ADMIN ? PermissionEntity.GOVERNMENT : PermissionEntity.CAMPAIGN,
                id: item.id,
                campaignId: item.campaign ? item.campaign.id : undefined,
                campaignName: item.campaign ? item.campaign.name : undefined,
                governmentId: item.government.id,
                governmentName: item.government.name,
            };
        }),
    };
}

export async function generateJWTokenAsync(userId: number): Promise<string> {
    const tokenObj = await createTokenObjectAsync(userId);
    const token = jsonwebtoken.sign(tokenObj, process.env.SECRET_KEY);
    return token;
}

export interface IJWTToken {
    payload: IToken;
}

export function decipherJWTokenAsync(token: string): Promise<IToken> {
    return new Promise((resolve, reject) => {
        try {
            jsonwebtoken.verify(token, process.env.SECRET_KEY);
        } catch (e) {
            reject(e);
        }
        const decoded = jsonwebtoken.decode(token, { complete: true }) as IJWTToken;
        const payload: IToken = decoded.payload;
        if (payload.exp < Date.now()) {
            throw new Error('Token expired');
        }
        resolve(payload);
    });
}
