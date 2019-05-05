import { User } from '../models/entity/User';
import { getConnection } from 'typeorm';

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

