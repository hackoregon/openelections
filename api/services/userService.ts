import { User } from '../models/entity/User';
import { getConnection } from 'typeorm';
import { sendPasswordResetEmail } from './emailService';
import { generateJWTokenAsync } from './permissionService';

export interface ICreateUser {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

export async function createUserAsync(userAttrs: ICreateUser): Promise<User> {
    const repository = getConnection('default').getRepository('User');
    const user = new User();
    user.firstName = userAttrs.firstName;
    user.lastName = userAttrs.lastName;
    user.email = userAttrs.email;
    if (userAttrs.password) {
        user.setPassword(userAttrs.password);
    } else {
        user.generateInvitationCode();
    }
    if (await user.isValidAsync()) {
        await repository.save(user);
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
    const user = await repository.findOneOrFail({invitationCode: params.invitationCode}) as User;
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
    await repository.save(user);

    return user;
}

export async function generatePasswordResetAsync(email: string): Promise<string> {
    const repository = getConnection('default').getRepository('User');
    const user = await repository.findOneOrFail({email: email}) as User;
    const code = user.generatePasswordResetCode();
    await repository.save(user);
    await sendPasswordResetEmail({to: user.email, invitationCode: user.invitationCode});
    return code;
}

export async function passwordResetAsync(invitationCode, password: string): Promise<User> {
    const repository = getConnection('default').getRepository('User');
    const user = await repository.findOneOrFail({invitationCode: invitationCode}) as User;
    if (password.length < 6) {
        throw new Error('User password must be at least 6 characters');
    }
    user.resetPassword(invitationCode, password);
    return repository.save(user);
}

export async function createUserSessionFromLoginAsync(email, password: string ): Promise<string> {
    const repository = getConnection('default').getRepository('User');
    try {
        const user = await repository.findOneOrFail({email}) as User;
        if (user.validatePassword(password)) {
            return generateJWTokenAsync(user.id);
        } else {
            throw new Error('Invalid email or password');
        }
    } catch (e) {
        throw new Error('Invalid email or password');
    }
}

