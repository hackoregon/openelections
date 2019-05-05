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

