import { getConnection } from 'typeorm';
import * as jsonwebtoken from 'jsonwebtoken';
import { Permission, UserRole } from '../models/entity/Permission';
import { Campaign } from '../models/entity/Campaign';
import { User } from '../models/entity/User';
import { Government } from '../models/entity/Government';
import { createUserAsync } from './userService';
import {sendInvitationEmail, sendNewUserInvitationEmail} from './emailService';

export interface IAddPermissionAsyncAttrs {
    userId: number;
    role: UserRole;
    campaignId?: number;
    governmentId?: number;
}

export async function addPermissionAsync(attrs: IAddPermissionAsyncAttrs): Promise<Permission> {
    const userRepository = getConnection('default').getRepository('User');
    const campaignRepository = getConnection('default').getRepository('Campaign');
    const govRepository = getConnection('default').getRepository('Government');
    const permissionRepository = getConnection('default').getRepository('Permission');

    const permission = new Permission();
    const userToAdd = await userRepository.findOneOrFail(attrs.userId) as User;
    permission.user = userToAdd;
    permission.role = attrs.role;

    let campaign: Campaign;

    if (attrs.campaignId) {
        campaign = await campaignRepository.findOneOrFail(attrs.campaignId) as Campaign;
        permission.campaign = campaign;
        permission.government = campaign.government;
    }
    let government: Government;
    if (attrs.governmentId) {
        government = await govRepository.findOneOrFail(attrs.governmentId) as Government;
        permission.government = government;
    }
    if (await permission.isValidAsync()) {
        await permissionRepository.save(permission);
    }

    return permission;
}

export async function removePermissionAsync(permissionId: number): Promise<boolean> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permission = await permissionRepository.findOneOrFail(permissionId) as Permission;
    if (permission) {
        return (await permissionRepository.delete(permissionId)).affected === 1;
    }
    return false;
}

export async function isGovernmentAdminAsync(userId, governmentId: number): Promise<boolean> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permission = await permissionRepository.createQueryBuilder('permission')
        .where('"userId" = :userId', {userId})
        .andWhere('"governmentId" = :governmentId', {governmentId})
        .andWhere('"role" = :role', {role: UserRole.GOVERNMENT_ADMIN})
        .getOne();

    return !!permission;
}

export async function isCampaignAdminAsync(userId, campaignId: number): Promise<boolean> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permission = await permissionRepository.createQueryBuilder('permission')
        .where('"userId" = :userId', {userId})
        .andWhere('"campaignId" = :campaignId', {campaignId})
        .andWhere('"role" = :role', {role: UserRole.CAMPAIGN_ADMIN})
        .getOne();

    return !!permission;
}

export async function isCampaignStaffAsync(userId, campaignId: number): Promise<boolean> {
    const permissionRepository = getConnection('default').getRepository('Permission');
    const permission = await permissionRepository.createQueryBuilder('permission')
        .where('"userId" = :userId', {userId})
        .andWhere('"campaignId" = :campaignId', {campaignId})
        .andWhere('"role" = :role', {role: UserRole.CAMPAIGN_STAFF})
        .getOne();

    return !!permission;
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
    const userRepository = getConnection('default').getRepository('User');
    const campaignRepository = getConnection('default').getRepository('Campaign');
    const campaign = await campaignRepository.findOneOrFail(attrs.campaignId) as Campaign;
    if (await isCampaignAdminAsync(attrs.currentUserId, attrs.campaignId) || await isGovernmentAdminAsync(attrs.currentUserId, campaign.government.id)) {
        let user = await userRepository.findOne({email: attrs.email}) as User;
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
        } else {
            await sendInvitationEmail({
                to: user.email,
                campaignName: campaign.name,
            });
        }
        return addPermissionAsync({
            userId: user.id,
            role: attrs.role,
            campaignId: campaign.id,
            governmentId: campaign.government.id
        });
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
    const userRepository = getConnection('default').getRepository('User');
    const governmentRepository = getConnection('default').getRepository('Government');
    const government = await governmentRepository.findOneOrFail(attrs.governmentId) as Government;
    if (await isGovernmentAdminAsync(attrs.currentUserId, government.id)) {
        let user = await userRepository.findOne({email: attrs.email}) as User;
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
        } else {

            await sendInvitationEmail({
                to: user.email,
                governmentName: government.name,
            });
        }
        return addPermissionAsync({userId: user.id, role: attrs.role, governmentId: government.id});
    }
    throw new Error('user does not have sufficient permissions');
}

export enum PermissionEntity {
    GOVERNMENT = 'government',
    CAMPAIGN = 'campaign'
}

export interface IToken {
    id: number;
    exp: number;
    firstName: string;
    lastName: string;
    email: string;
    permissions: {
        id: number,
        type: PermissionEntity,
        role: UserRole
    }[];
}

export interface PermissionsRawQueryResult {
    permission_id: number;
    permission_role: UserRole;
    permission_governmentId?: number;
    permission_campaignId?: number;
    permission_userId: number;
}

export async function createTokenObjectAsync(userId: number): Promise<IToken> {
    const userRepository = getConnection('default').getRepository('User');
    const permissionRepository = getConnection('default').getRepository('Permission');
    const user = await userRepository.findOneOrFail(userId) as User;
    const permissions = (await permissionRepository.createQueryBuilder('permission')
        .where('"userId" = :userId', {userId}).getRawAndEntities()).raw as PermissionsRawQueryResult[];
    const exp = Date.now() + (72 * 60 * 60 * 1000); // 72 hours from now in miliseconds
    return {
        id: userId,
        exp,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        permissions: permissions.map(item => {
            if (item.permission_campaignId) {
                return {
                    role: item.permission_role,
                    type: PermissionEntity.CAMPAIGN,
                    id: item.permission_campaignId
                };
            } else if (item.permission_governmentId) {
                return {
                    role: item.permission_role,
                    type: PermissionEntity.GOVERNMENT,
                    id: item.permission_governmentId
                };
            }
        })
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
        const decoded = jsonwebtoken.decode(token, {complete: true}) as IJWTToken;
        const payload: IToken = decoded.payload;
        if (payload.exp < Date.now()) {
            throw new Error('Token expired');
        }
        resolve(payload);
    });
}
