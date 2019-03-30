import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as bcrypt from 'bcryptjs';

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

    async validatePassword(plainTextPassword: string) {
        return await bcrypt.compare(plainTextPassword, this.passwordHash);
    }
    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        };
    }

}
