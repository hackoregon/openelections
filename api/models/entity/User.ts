import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsDefined, validate, ValidationError } from 'class-validator';
import * as crypto from 'crypto';
import { Permission } from './Permission';
import { Activity } from './Activity';

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

export enum UserStatus {
    INVITED = 'invited',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity({name: 'users'})
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
    @IsDefined()
    email: string;

    @Column()
    @IsDefined()
    salt: string;

    @OneToMany(type => Permission, permission => permission.user)
    permissions: Promise<Permission[]>;

    @OneToMany(type => Activity, activity => activity.user)
    activities: Promise<Activity[]>;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.INVITED
    })
    userStatus: UserStatus;

    @Column({ nullable: true })
    invitationCode: string;


    public errors: ValidationError[];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await this.validateAsync();
        if (this.errors.length > 0) {
            throw new Error('user has one or more validation problems');
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    downCaseEmail() {
        if (this.email) {
            this.email = this.email.toLowerCase();
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
            email: this.email,
            userStatus: this.userStatus,
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

    resetPassword(code, newPassword: string): boolean {
        if (this.userStatus !== UserStatus.ACTIVE) {
            throw new Error('Cannot reset an inactive or invited user');
        }
        if (code !== this.invitationCode) {
            throw new Error('code must match invitationCode to reset password');
        }
        this.setPassword(newPassword);
        this.invitationCode = null;
        return true;
    }

    generatePasswordResetCode() {
        if (this.userStatus !== UserStatus.ACTIVE) {
            throw new Error('Cannot reset an inactive or invited user');
        }
        const invitationCode = crypto.randomBytes(16).toString('hex');
        this.invitationCode = invitationCode;
        return invitationCode;
    }

    generateInvitationCode() {
        const invitationCode = crypto.randomBytes(16).toString('hex');
        this.userStatus = UserStatus.INVITED;
        this.invitationCode = invitationCode;
        this.setPassword(invitationCode);
        return invitationCode;
    }

    redeemInvitation(code, newPassword: string) {
        if (this.validatePassword(code)) {
            this.setPassword(newPassword);
            this.invitationCode = null;
            this.userStatus = UserStatus.ACTIVE;
            return true;
        }
        return false;
    }

    name() {
        return `${this.firstName} ${this.lastName}}`;
    }
}

export interface IUserSummary {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userStatus: UserStatus;
}
