import { User, UserStatus } from '../models/entity/User';
import { getConnection } from 'typeorm';
import { resendInvitationEmail, sendPasswordResetEmail } from './emailService';
import { generateJWTokenAsync, isCampaignAdminAsync, isGovernmentAdminAsync } from './permissionService';
import {
    getPermissionsByCampaignIdAsync,
    getPermissionsByGovernmentIdAsync,
    IUserPermission,
} from '../models/entity/Permission';
import { Campaign } from '../models/entity/Campaign';
import { createActivityRecordAsync } from './activityService';
import { ActivityTypeEnum } from '../models/entity/Activity';

export interface ICreateUser {
    email: string;
    password?: string;
    invitationCode?: string;
    firstName: string;
    lastName: string;
}

export async function createUserAsync(userAttrs: ICreateUser): Promise<User> {
    const repository = getConnection('default').getRepository('User');
    const user = new User();
    user.firstName = userAttrs.firstName;
    user.lastName = userAttrs.lastName;
    user.email = userAttrs.email;
    if (userAttrs.password) {
        user.setPassword(userAttrs.password);
        user.userStatus = UserStatus.ACTIVE;
    } else {
        user.generateInvitationCode();
        if (userAttrs.invitationCode) {
            user.invitationCode = userAttrs.invitationCode;
        }
    }
    if (await user.isValidAsync()) {
        await repository.save(user);
    } else {
        throw new Error(`User invalid ${user.errors}`);
    }
    return user;
}

export interface IAcceptInvitationAttrs {
    invitationCode: string;
    firstName?: string;
    lastName?: string;
    password: string;
}

export async function acceptUserInvitationAsync(params: IAcceptInvitationAttrs): Promise<User> {
    const repository = getConnection('default').getRepository('User');
    let user = await repository.findOneOrFail({invitationCode: params.invitationCode}) as User;
    if (params.password.length < 6) {
        throw new Error('User password must be at least 6 characters');
    }
    user.redeemInvitation(params.invitationCode, params.password);
    if (params.firstName) {
        user.firstName = params.firstName;
    }
    if (params.lastName) {
        user.lastName = params.lastName;
    }
    user = await repository.save(user);
    await createActivityRecordAsync({
        currentUser: user,
        notes: `${user.name} redeemed their invitation`,
        activityType: ActivityTypeEnum.USER,
        activityId: user.id
    });
    return user;
}

export async function generatePasswordResetAsync(email: string): Promise<string> {
    const repository = getConnection('default').getRepository('User');
    const user = await repository.findOneOrFail({email: email}) as User;
    const code = user.generatePasswordResetCode();
    await repository.save(user);
    await sendPasswordResetEmail({to: user.email, invitationCode: user.invitationCode});
    await createActivityRecordAsync({
        currentUser: user,
        notes: `${user.name} was sent an email to reset their password`,
        activityType: ActivityTypeEnum.USER,
        activityId: user.id
    });
    return code;
}

export async function passwordResetAsync(invitationCode, password: string): Promise<User> {
    const repository = getConnection('default').getRepository('User');
    let user = await repository.findOneOrFail({invitationCode: invitationCode}) as User;
    if (password.length < 6) {
        throw new Error('User password must be at least 6 characters');
    }
    user.resetPassword(invitationCode, password);
    user = await repository.save(user);
    await createActivityRecordAsync({
        currentUser: user,
        notes: `${user.name} updated their password`,
        activityType: ActivityTypeEnum.USER,
        activityId: user.id
    });
    return user;
}

export async function createUserSessionFromLoginAsync(email, password: string): Promise<string> {
    const repository = getConnection('default').getRepository('User');
    try {
        const user = await repository.findOneOrFail({email}) as User;
        if (user.validatePassword(password)) {
            const token = generateJWTokenAsync(user.id);
            await createActivityRecordAsync({
                currentUser: user,
                notes: `${user.name} logged in`,
                activityType: ActivityTypeEnum.USER,
                activityId: user.id
            });
            return token;
        } else {
            throw new Error('Invalid email or password');
        }
    } catch (e) {
        throw new Error('Invalid email or password');
    }
}

export async function updateUserPasswordAsync(userId: number, currentPassword, newPassword: string): Promise<boolean> {
    const repository = getConnection('default').getRepository('User');
    const user = await repository.findOneOrFail(userId) as User;
    if (user.validatePassword(currentPassword)) {
        if (newPassword.length < 6) {
            throw new Error('Invalid password');
        }
        user.setPassword(newPassword);
        await repository.save(user);
        await createActivityRecordAsync({
            currentUser: user,
            notes: `${user.name} updated their password`,
            activityType: ActivityTypeEnum.USER,
            activityId: user.id
        });
    } else {
        throw new Error('Invalid password');
    }
    return true;
}

export async function resendInvitationAsync(userId: number): Promise<boolean> {
    const repository = getConnection('default').getRepository('User');
    const user = await repository.findOneOrFail(userId) as User;
    if (user.userStatus === UserStatus.INVITED && user.invitationCode) {
        await resendInvitationEmail({to: user.email, invitationCode: user.invitationCode});
        await createActivityRecordAsync({
            currentUser: user,
            notes: `${user.name} was re-sent an invitation email`,
            activityType: ActivityTypeEnum.PERMISSION,
            activityId: user.id
        });
        return true;
    } else {
        throw new Error('User is already in the system or there is no invitation code');
    }
}

export interface IRetrieveUserParams {
    currentUserId: number;
    governmentId?: number;
    campaignId?: number;
}


export async function retrieveUserPermissionsAsync(attrs: IRetrieveUserParams): Promise<IUserPermission[]> {
    if (attrs.campaignId) {
        const campaignRepository = getConnection('default').getRepository('Campaign');
        const campaign = await campaignRepository.findOneOrFail(attrs.campaignId) as Campaign;
        if (await isCampaignAdminAsync(attrs.currentUserId, attrs.campaignId) || await isGovernmentAdminAsync(attrs.currentUserId, campaign.government.id)) {
            return getPermissionsByCampaignIdAsync(attrs.campaignId);
        }
        return [];
    } else if (attrs.governmentId && (await isGovernmentAdminAsync(attrs.currentUserId, attrs.governmentId))) {
        return getPermissionsByGovernmentIdAsync(attrs.governmentId);
    }
    return [];
}
