import * as express from 'express';
import { expect } from 'chai';
import * as faker from 'faker';
import * as request from 'supertest';
import { setupRoutes } from '../../../routes';
import { User } from '../../../models/entity/User';
import {
    newActiveUserAsync,
    truncateAll
} from '../../factories';
import { generatePasswordResetAsync } from '../../../services/userService';

let app: express.Express;
let govAdmin: User;

describe('Routes /users', () => {
    before(async () => {
        app = express();
        setupRoutes(app);
    });

    beforeEach(async () => {
        govAdmin = await newActiveUserAsync();
    });

    afterEach(async () => {
        await truncateAll();
    });

    context('/users/send-password-reset-email', () => {
        it('fails, no user found', async () => {
            const email = faker.internet.email();
            const response = await request(app)
                .post('/users/send-password-reset-email')
                .send({
                    email
                })
                .set('Accept', 'application/json');
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal(`Could not find any entity of type "User" matching: {\n    "email": "${email}"\n}`);
        });

        it('succeeds, user found', async () => {
            const email = faker.internet.email();
            const response = await request(app)
                .post('/users/send-password-reset-email')
                .send({
                    email: govAdmin.email
                })
                .set('Accept', 'application/json');
            expect(response.status).to.equal(200);
        });
    });

    context('/users/reset-password', () => {
        it('fails, invitation code not found', async () => {
            const email = faker.internet.email();
            const response = await request(app)
                .post('/users/reset-password')
                .send({
                    invitationCode: 'nope',
                    password: 'lotsofnope'
                })
                .set('Accept', 'application/json');
            expect(response.status).to.equal(422);
            expect(response.body.message).to.equal(`Could not find any entity of type "User" matching: {\n    "invitationCode": "nope"\n}`);
        });

        it('succeeds, user found', async () => {
            const code = await generatePasswordResetAsync(govAdmin.email);
            const response = await request(app)
                .post('/users/reset-password')
                .send({
                    invitationCode: code,
                    password: 'lotsofnope'
                })
                .set('Accept', 'application/json');
            expect(response.status).to.equal(200);
        });
    });

});
