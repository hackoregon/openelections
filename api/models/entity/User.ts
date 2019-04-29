import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate} from 'typeorm';
import { IsEmail, IsDefined, validate, ValidationError } from 'class-validator';
import * as crypto from 'crypto';
import { Permission } from './Permission';

export interface IPasswordHash {
    hash: string;
    salt: string;
}

export function createHash(password: string): IPasswordHash  {
    if (!password) {
        throw new Error('must supply a password');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    return {
        salt,
        hash
    };
}

export function md5(text: string) {
    if (!text) {
        throw new Error('must supply text to hash');
    }
    return crypto.createHash('md5').update(text).digest('hex');
}


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsDefined()
    firstName: string;

    @Column()
    @IsDefined()
    lastName: string;

    @Column()
    @IsDefined()
    passwordHash: string;

    @Column()
    @IsEmail()
    @IsDefined()
    email: string;

    @Column()
    @IsDefined()
    salt: string;

    @OneToMany(type => Permission, permission => permission.user)
    permissions: Permission[];

    public errors: ValidationError[];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await this.validateAsync();
        if (this.errors.length > 0) {
            throw new Error('user has one or more validation problems')
        }
    }

    async isValidAsync(): Promise<boolean> {
    await this.validateAsync();
    return this.errors.length === 0;
    }


    async validateAsync() {
        const errors = await validate(this);
        this.errors = errors;
    }

    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        };
    }

    validatePassword(password: string) {
        if (!password) {
            throw new Error('must set a password');
        }
        const validHash = crypto.pbkdf2Sync(password, this.salt, 2048, 32, 'sha512').toString('hex');
        return this.passwordHash === validHash;
    }

    setPassword(password) {
        if (!password) {
            throw new Error('must set a password');
        }
        const { salt, hash } = createHash(password);
        this.passwordHash = hash;
        this.salt = salt;
    }

}
