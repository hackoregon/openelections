import { User, createHash, md5 } from '../../models/entity/User';
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { ValidationError } from 'class-validator';

let userRepository: any;

describe('User', () => {
    before(() => {
        userRepository = getConnection('default').getRepository('User');
    });

    afterEach(async () => {
        await userRepository.query('TRUNCATE "user" CASCADE');
    });

    it('md5', async () => {
        const hashObject = md5('password');
        expect(hashObject).to.equal('5f4dcc3b5aa765d61d8327deb882cf99');
    });

    it('setPassword', async () => {
        const user = new User();
        expect(user.passwordHash).to.be.undefined;
        expect(user.salt).to.be.undefined;
        user.setPassword('password');
        expect(user.passwordHash).to.not.be.undefined;
        expect(user.salt).to.not.be.undefined;
    });

    context('Validations', () => {
        it('firstName lastName', async () => {
            const user = new User();
            await user.validateAsync();
            expect(user.errors[0].property).equal('firstName');
            expect(user.errors[0].constraints.isDefined).equal('firstName should not be null or undefined');
            expect(user.errors[1].property).equal('lastName');
            expect(user.errors[1].constraints.isDefined).equal('lastName should not be null or undefined');
        });

        it('passswordHash', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            await user.validateAsync();
            expect(user.errors[0].property).equal('passwordHash');
            expect(user.errors[0].constraints.isDefined).equal('passwordHash should not be null or undefined');
        });

        it('email null', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            await user.validateAsync();
            expect(user.errors[0].property).equal('email');
            expect(user.errors[0].constraints.isDefined).equal('email should not be null or undefined');
            expect(user.errors[0].constraints.isEmail).equal('email must be an email');
        });

        it('email invalid', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'love';
            await user.validateAsync();
            expect(user.errors[0].property).equal('email');
            expect(user.errors[0].constraints.isEmail).equal('email must be an email');
        });

        it('isValid', async () => {
            const user = new User();
            expect(await user.isValidAsync()).to.be.false;
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'dan@civicsoftwarefoundation.org';
            expect(await user.isValidAsync()).to.be.true;
        });

        it('validate throws error', async () => {
            const user = new User();
            try {
                await userRepository.save(user);
            } catch (e) {
                expect(e.message).to.equal('user has one or more validation problems');
            }
        });

        it('validate does not throws error', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'dan@civicsoftwarefoundation.org';
            expect(await userRepository.count()).equal(0);
            await userRepository.save(user);
            expect(await userRepository.count()).equal(1);
        });

    });

    context('JSON', () => {
        it('toJson', async () => {
            const user = new User();
            user.firstName = 'Dan';
            user.lastName = 'Melton';
            user.setPassword('password');
            user.email = 'dan@civicsoftwarefoundation.org';
            await userRepository.save(user);
            const userJson = user.toJSON();
            expect(userJson.id).to.not.be.undefined;
            expect(userJson.firstName).to.equal('Dan');
            expect(userJson.lastName).to.equal('Melton');
            expect(userJson.email).to.equal('dan@civicsoftwarefoundation.org');
        });
    });

});
