let redisClient: any;
if (process.env.NODE_ENV === 'test') {
    const Redis = require('ioredis-mock');
    redisClient = new Redis();
} else {
    const Redis = require('ioredis');
    redisClient = new Redis(process.env.REDIS_URL);
    redisClient.on('connect', () => console.log(' [*] Redis: Connection Succeeded.'));
    redisClient.on('error', err => console.error(err));
}

export default redisClient;

