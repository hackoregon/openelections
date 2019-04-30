import redisClient from '../models/redis';
import { expect } from 'chai';

describe('redisClient examples', () => {
    beforeEach(async () => {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('Dont run this command in production or develop :(');
        }
        await redisClient.flushall();
    })
    it('set and get', async () => {
        expect(await redisClient.get('love')).to.be.null;
        await redisClient.set('love', 1);
        expect(await redisClient.get('love')).to.equal('1');
    });

    it('test clears between runs', async () => {
        expect(await redisClient.get('love')).to.be.null;
    });
});
