import * as express from 'express';

import * as request from 'supertest';
import { setupRoutes } from '../../routes';
import { User } from '../../models/entity/User';
import { newActiveUserAsync, truncateAll } from '../factories';
import { generateJWTokenAsync } from '../../services/permissionService';

let app: express.Express;
let user: User;

describe('Route helpers', () => {
    beforeAll(async () => {
        app = express();
        setupRoutes(app);
    });

    beforeEach(async () => {
        user = await newActiveUserAsync();
    });

    afterEach(async () => {
        await truncateAll();
    });

    describe('getCurrentUser', () => {
        it('fails incorrect or expired token', async () => {
            const response = await request(app)
                .get('/me')
                .set('Cookie', ['token=12345667'])
                .set('Accept', 'application/json');
            expect(response.status).toEqual(401);
            expect(response.body.message).toEqual('Token expired or incorrect');
            expect(response.header['set-cookie']).toEqual(['token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT']);
        });

        it('succeeds', async () => {
            const token = await generateJWTokenAsync(user.id);
            const response = await request(app)
                .get('/me')
                .set('Cookie', [`token=${token}`])
                .set('Accept', 'application/json');
            expect(response.status).toEqual(200);
            expect(Object.keys(response.body)).toEqual([
                'id',
                'exp',
                'firstName',
                'lastName',
                'email',
                'permissions',
                'iat',
            ]);
        });
    });
});
