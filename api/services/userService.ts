import { User } from '../models/entity/User';
import { getConnection } from 'typeorm';

const crypto = require('crypto');

const SaltLength = 9;

export interface IPasswordHash {
    hash: string;
    salt: string;
}

export function createHash(password: string): IPasswordHash  {
    const salt = generateSalt(SaltLength);
    const hash = md5(salt + password);
    return {hash, salt};
}

export function validateHash(hash: string, password: string) {
    const salt = hash.substr(0, SaltLength);
    const validHash = salt + md5(password + salt);
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

export function md5(string: string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

export interface ICreateUser {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export function createUserAsync(userAttrs: ICreateUser) {
    const repository = getConnection('default').getRepository('User');
    const user = new User();
    user.firstName = userAttrs.firstName;
    user.lastName = userAttrs.lastName;
    user.email = userAttrs.email;
    const { salt, hash } = createHash(userAttrs.password);
    user.salt = salt;
    user.passwordHash = hash;
    return repository.save(user);
}
