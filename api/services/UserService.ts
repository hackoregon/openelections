import { User } from '../models/entity/User';
import { getRepository } from 'typeorm';

import * as crypto from 'crypto';

const SaltLength = 9;

export interface IPasswordHash {
    hash: string;
    salt: string;
}

export function createHash(password: string): IPasswordHash  {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    return {
        salt,
        hash
    };
}

export function validateHash(hash: string, salt: string, password: string) {
    const validHash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    return hash === validHash;
}

export function generateSalt(len: number) {
    const set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
        setLen = set.length;
    let salt = '';
    for (let i = 0; i < len; i++) {
        const p = Math.floor(Math.random() * setLen);
        salt += set[p];
    }
    return salt;
}

// export function md5(string: string) {
//     return crypto.createHash('md5').update(string).digest('hex');
// }

export interface ICreateUser {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export function createUserAsync(userAttrs: ICreateUser) {
    const repository = getRepository(User);
    const user = new User();
    user.firstName = userAttrs.firstName;
    user.lastName = userAttrs.lastName;
    user.email = userAttrs.email;
    const { salt, hash } = createHash(userAttrs.password);
    user.salt = salt;
    user.passwordHash = hash;
    return repository.save(user);
}
