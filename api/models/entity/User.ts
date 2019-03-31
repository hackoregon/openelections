import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
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

export function md5(string: string) {
    return crypto.createHash('md5').update(string).digest('hex');
}


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    passwordHash: string;

    @Column()
    email: string;

    @Column()
    salt: string;

    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        };
    }

    validatePassword(password: string) {
        const validHash = crypto.pbkdf2Sync(password, this.salt, 2048, 32, 'sha512').toString('hex');
        return this.passwordHash === validHash;
    }

    setPassword(password) {
        const { salt, hash } = createHash(password)
        this.passwordHash = hash;
        this.salt = salt;
    }

}
