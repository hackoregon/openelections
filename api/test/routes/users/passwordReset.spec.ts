import * as express from 'express';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { setupRoutes } from '../../../routes';
import { User } from '../../../models/entity/User';
import { newActiveUserAsync, truncateAll } from '../../factories';
import { generatePasswordResetAsync } from '../../../services/userService';
import { generateJWTokenAsync } from '../../../services/permissionService';

let app: express.Express;
let govAdmin: User;
let govAdminToken: string;

describe('Routes /users', () => {
    beforeAll(async () => {
        app = express();
        setupRoutes(app);
    });

    beforeEach(async () => {
        govAdmin = await newActiveUserAsync();
        govAdminToken = await generateJWTokenAsync(govAdmin.id);
    });

    afterEach(async () => {
        await truncateAll();
    });

    describe('/users/send-password-reset-email', () => {
        it('fails, no user found', async () => {
            const email = faker.internet.email();
            const response = await request(app)
                .post('/users/send-password-reset-email')
                .send({
                    email,
                })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual(
                `Could not find any entity of type "User" matching: {\n    "email": "${email}"\n}`
            );
        });

        it('succeeds, user found', async () => {
            const email = faker.internet.email();
            const response = await request(app)
                .post('/users/send-password-reset-email')
                .send({
                    email: govAdmin.email,
                })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(204);
        });
    });

    describe('/users/reset-password', () => {
        it('fails, invitation code not found', async () => {
            const email = faker.internet.email();
            const response = await request(app)
                .post('/users/reset-password')
                .send({
                    invitationCode: 'nope',
                    password: 'lotsofnope',
                })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual(
                `Could not find any entity of type "User" matching: {\n    "invitationCode": "nope"\n}`
            );
        });

        it('succeeds, user found', async () => {
            const code = await generatePasswordResetAsync(govAdmin.email);
            const response = await request(app)
                .post('/users/reset-password')
                .send({
                    invitationCode: code,
                    password: 'lotsofnope',
                })
                .set('Accept', 'application/json');
            expect(response.status).toEqual(204);
        });
    });

    describe('/users/password', () => {
        it('fails, password not valid', async () => {
            const response = await request(app)
                .put('/users/password')
                .send({
                    currentPassword: 'password1',
                    newPassword: 'password2',
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('Invalid password');
        });

        it('fails, new password not valid', async () => {
            const response = await request(app)
                .put('/users/password')
                .send({
                    currentPassword: 'password',
                    newPassword: 'p',
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(422);
            expect(response.body.message).toEqual('Invalid password');
        });

        it('succeeds, new password valid', async () => {
            const response = await request(app)
                .put('/users/password')
                .send({
                    currentPassword: 'password',
                    newPassword: 'password2',
                })
                .set('Accept', 'application/json')
                .set('Cookie', [`token=${govAdminToken}`]);
            expect(response.status).toEqual(204);
        });
    });
});
