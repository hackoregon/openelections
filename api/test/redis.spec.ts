import redisClient from '../models/redis';

describe('redisClient examples', () => {
    beforeEach(async () => {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('Dont run this command in production or develop :(');
        }
        await redisClient.flushall();
    });
    it('set and get', async () => {
        expect(await redisClient.get('love')).toBeNull();
        await redisClient.set('love', 1);
        expect(await redisClient.get('love')).toEqual('1');
    });

    it('test clears between runs', async () => {
        expect(await redisClient.get('love')).toBeNull();
    });
});
