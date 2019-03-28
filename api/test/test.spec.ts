import * as chai from 'chai';
import { describe, it } from 'mocha';
import { initialUserArray } from '../models/seeds/users';
const { expect } = chai;
import axios from 'axios';




describe('Find initial seeded users', () => {
  it('Fetches /users endpoint', function(done) {
    axios.get('http://localhost:3000/users')
      .then( res => {
        expect(res.status).to.equal(200);
        expect(res.data.users).to.deep.equal(initialUserArray);
        done();
      })
      .catch( err => {
        console.log(err);
        done();
      });
  });
});

// describe('Fetch /users data', () => {
//   axios.get('http://localhost:3000/users')
//     .then( res => {
//       it('should return status 200', (done) => {
//         expect(res.status).to.equal(200);
//         done();
//       });
//       it('should return initial user data', (done) => {
//         expect(res.data.users).to.deep.equal(initialUserArray);
//         done();
//       });
//     })
//     .catch( err => {
//       console.log(err);
//     });
// });