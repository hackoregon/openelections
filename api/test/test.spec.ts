import * as chai from 'chai';
import { describe, it } from 'mocha';
import { initialUserArray } from '../models/seeds/users';
const { expect } = chai;
import axios from 'axios';
const rootUrl = 'http://localhost:3000/';
describe('Find initial seeded users', () => {
  it('Fetches /users endpoint', (done) => {
    axios.get(rootUrl + 'users')
      .then( res => {
        console.log('[TESTING . . .]: ', res.data);
        expect(res.status).to.equal(200);
        expect(res.data.users[0]).to.have.all.keys('firstName', 'lastName', 'email', 'id');
        expect(res.data.users[0]).to.not.have.any.keys('password');
        done();
      })
      .catch( err => {
        done(err);
      });
  });
});

describe('Create User', () => {
  it('Adds a user into the database', (done) => {
    const testUser = {
      firstName: 'Andy',
      lastName: 'Testing',
      email: 'andy@email.com',
      password: 'password'
    };
    axios.post(rootUrl + 'signup', testUser)
      .then( res => {
        expect(res.data).to.be.an('object');
        expect(res.data).to.not.have.any.keys('password');
        done();
      })
      .catch( err => {
        done(err);
      });
  });
});