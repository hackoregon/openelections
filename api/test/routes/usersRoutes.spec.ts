import * as express from 'express';
import { expect } from 'chai';
import * as request from 'supertest';
import { setupRoutes } from '../../routes';
import { User } from '../../models/entity/User';
import { newActiveUserAsync, truncateAll } from '../factories';

let app: express.Express;
let user: User;

describe('Routes /users', () => {
    before(async () => {
        app = express();
        setupRoutes(app);
    });

    beforeEach(async () => {
        user = await newActiveUserAsync();
    });

    afterEach(async () => {
        await truncateAll();
    });

    context('/users/login', () => {
        it('email not found', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({password: 'password'})
                .send({email: 'dan@civicsoftwarefoundation.org'})
                .set('Accept', 'application/json');
            expect(response.status).to.equal(401);
            expect(response.body.message).to.equal('No user found with email or password');
        });

        it('password not correct', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({password: 'password1'})
                .send({email: user.email})
                .set('Accept', 'application/json');
            expect(response.status).to.equal(401);
            expect(response.body.message).to.equal('No user found with email or password');
        });

        it('success, sets token in cookie', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({password: 'password'})
                .send({email: user.email})
                .set('Accept', 'application/json');
            expect(response.status).to.equal(204);

            const regex = /(.*?)=(.*?)($|;|,(?! ))/g;
            const matches = [];
            let match = regex.exec(response.header['set-cookie']);
            while (match != undefined) {
                matches.push(match[1]);
                match = regex.exec(response.header['set-cookie']);
            }
            expect(matches).to.deep.equal([ 'token', ' Path', ' Expires' ]);
        });
    });
});
